import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { config } from '../../bootstrap/config';
import { logger } from '../../bootstrap/logger';
import { CrisisType } from '../../repositories/crisisRepo';
import { VisualFeatures } from '../vision/visionClient';

// ---------------------------------------------------------------------------
// Client setup
// ---------------------------------------------------------------------------

let _flashModel: GenerativeModel | null = null;
let _proModel: GenerativeModel | null = null;

function getFlashModel(): GenerativeModel {
  if (!_flashModel) {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    _flashModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }
  return _flashModel;
}

function getProModel(): GenerativeModel {
  if (!_proModel) {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    _proModel = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
  }
  return _proModel;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GeminiClassification {
  crisis_type: CrisisType;
  severity: number;
  confidence: number;
  floor: string;
  zone: string;
  reasoning: string;
}

export interface GeminiOrchestration {
  dispatch_decisions: Array<{
    staff_id: string;
    staff_name: string;
    role: string;
    instruction: string;
    priority: 'primary' | 'secondary';
    equipment_to_bring: string[];
    route: string;
  }>;
  backup_assignments: Array<{
    staff_id: string;
    role: string;
    instruction: string;
  }>;
  guest_notification: {
    affected_floors: string[];
    message: string;
    evacuation_route: string;
    tone: 'calm' | 'urgent';
  };
  control_room_summary: string;
  external_escalation: {
    required: boolean;
    service: 'fire_dept' | 'ambulance' | 'police' | 'none';
    reason: string;
    auto_call_in_minutes: number;
  };
  decision_reasoning: string;
  alternatives_considered: string[];
  confidence: number;
}

// ---------------------------------------------------------------------------
// Crisis classification — Gemini Flash
// ---------------------------------------------------------------------------

const CLASSIFICATION_SYSTEM_PROMPT = `You are a crisis classification AI for a hospitality venue emergency response system.

Your job: analyse a crisis report and return a structured JSON classification.

Rules:
- Be conservative. Only return high severity if clearly warranted.
- crisis_type must be exactly one of: fire, medical, security, stampede, structural, unknown
- severity: integer 1 (minor) to 5 (catastrophic)
- confidence: float 0.0 to 1.0
- floor: extract from text or return "unknown"
- zone: extract from text or return "unknown"
- reasoning: one concise sentence explaining your classification

Respond ONLY with valid JSON matching this exact schema:
{
  "crisis_type": string,
  "severity": number,
  "confidence": number,
  "floor": string,
  "zone": string,
  "reasoning": string
}`;

export async function classifyWithGemini(
  reportText: string,
  floor?: string,
  zone?: string,
  triggerSources?: string[],
  visualFeatures?: VisualFeatures
): Promise<GeminiClassification> {
  const model = getFlashModel();

  const contextParts = [
    reportText && `Report: "${reportText}"`,
    floor && `Known floor: ${floor}`,
    zone && `Known zone: ${zone}`,
    triggerSources?.length && `Trigger sources: ${triggerSources.join(', ')}`,
    visualFeatures && [
      `--- Visual context (Cloud Vision) ---`,
      `Person count: ${visualFeatures.person_count} (density: ${visualFeatures.crowd_density})`,
      `Fire/smoke detected: ${visualFeatures.fire_smoke_signal} (confidence: ${visualFeatures.fire_smoke_confidence})`,
      `Security signal: ${visualFeatures.security_signal}`,
      `Objects detected: ${visualFeatures.objects_detected.join(', ') || 'none'}`,
      `Scene labels: ${visualFeatures.raw_labels.join(', ') || 'none'}`,
    ].join('\n'),
  ]
    .filter(Boolean)
    .join('\n');

  const prompt = `${CLASSIFICATION_SYSTEM_PROMPT}\n\nInput:\n${contextParts}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code fences if Gemini wraps the response
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  let parsed: GeminiClassification;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    logger.error('geminiClient: failed to parse classification response', { raw: text });
    // Fallback so the pipeline never hard-crashes
    return {
      crisis_type: 'unknown',
      severity: 2,
      confidence: 0.4,
      floor: floor ?? 'unknown',
      zone: zone ?? 'unknown',
      reasoning: 'Gemini response could not be parsed — defaulting to unknown.',
    };
  }

  // Clamp values to valid ranges
  parsed.severity = Math.max(1, Math.min(5, Math.round(parsed.severity)));
  parsed.confidence = Math.max(0, Math.min(1, parsed.confidence));

  logger.info('geminiClient: classification complete', {
    crisis_type: parsed.crisis_type,
    severity: parsed.severity,
    confidence: parsed.confidence,
  });

  return parsed;
}

// ---------------------------------------------------------------------------
// Full orchestration — Gemini Pro
// ---------------------------------------------------------------------------

const ORCHESTRATION_SYSTEM_PROMPT = `You are HAVEN, an AI Incident Commander for a hospitality venue.

Your role: receive a crisis event and full venue context, then output a complete structured response plan.

Decision principles:
1. Life safety first — always
2. Route the CORRECT role to the CORRECT crisis type:
   - fire → fire_marshal primary, security secondary
   - medical → medical_officer primary, nearest available secondary
   - security → security primary — do NOT send medical or fire as primary
   - stampede → security + medical simultaneously, escalate externally immediately
   - structural → security for evacuation only — do NOT send anyone into the affected zone
3. Never send an untrained responder as primary
4. Guest messages must be calm, directive, and brief — one sentence max
5. If no trained responder is available, mark external_escalation.required = true

Respond ONLY with valid JSON matching this exact schema:
{
  "dispatch_decisions": [
    {
      "staff_id": string,
      "staff_name": string,
      "role": string,
      "instruction": string,
      "priority": "primary" | "secondary",
      "equipment_to_bring": [string],
      "route": string
    }
  ],
  "backup_assignments": [
    {
      "staff_id": string,
      "role": string,
      "instruction": string
    }
  ],
  "guest_notification": {
    "affected_floors": [string],
    "message": string,
    "evacuation_route": string,
    "tone": "calm" | "urgent"
  },
  "control_room_summary": string,
  "external_escalation": {
    "required": boolean,
    "service": "fire_dept" | "ambulance" | "police" | "none",
    "reason": string,
    "auto_call_in_minutes": number
  },
  "decision_reasoning": string,
  "alternatives_considered": [string],
  "confidence": number
}`;

export async function orchestrateWithGemini(
  crisis: {
    crisis_type: string;
    severity: number;
    floor: string;
    zone?: string;
    report_text?: string;
    estimated_persons?: number;
  },
  venueContext: {
    current_time: string;
    available_personnel: Array<{
      staff_id: string;
      name: string;
      role: string;
      floor: string;
      certifications?: string[];
    }>;
    evacuation_routes?: Array<{ route_id: string; status: string; label: string }>;
    equipment_stations?: Array<{ station_id: string; type: string; floor: string }>;
    recent_incidents?: string;
    active_events?: string;
  }
): Promise<GeminiOrchestration> {
  const model = getProModel();

  const prompt = `${ORCHESTRATION_SYSTEM_PROMPT}

CRISIS EVENT:
${JSON.stringify(crisis, null, 2)}

VENUE CONTEXT:
Current time: ${venueContext.current_time}
Active events: ${venueContext.active_events ?? 'none'}

Available personnel:
${JSON.stringify(venueContext.available_personnel, null, 2)}

Evacuation routes:
${JSON.stringify(venueContext.evacuation_routes ?? [], null, 2)}

Equipment stations:
${JSON.stringify(venueContext.equipment_stations ?? [], null, 2)}

Recent incident history (last 2 hours):
${venueContext.recent_incidents ?? 'none'}

Make the optimal response decision now.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  let parsed: GeminiOrchestration;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    logger.error('geminiClient: failed to parse orchestration response', { raw: text });
    throw new Error('Gemini orchestration response could not be parsed');
  }

  logger.info('geminiClient: orchestration complete', {
    dispatch_count: parsed.dispatch_decisions.length,
    external_escalation: parsed.external_escalation.required,
    confidence: parsed.confidence,
  });

  return parsed;
}
