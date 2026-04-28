import { Request, Response } from 'express';
import { z } from 'zod';
import { logger } from '../../bootstrap/logger';
import {
  classifyWithGemini,
  orchestrateWithGemini,
  GeminiOrchestration,
} from '../../integrations/gemini/geminiClient';
import { personnelRepo } from '../../repositories/personnelRepo';
import { AppError } from '../../utils/errors';

// ---------------------------------------------------------------------------
// POST /api/v1/demo/analyze
//
// Synchronous single-call analysis endpoint for the Flutter demo app.
// Runs Gemini classification + orchestration in one HTTP round-trip so the
// Flutter UI gets the full AI response without needing Firestore listeners.
//
// No auth guard — demo use only. Venue defaults to venue_demo_001.
// ---------------------------------------------------------------------------

const analyzeBodySchema = z.object({
  report_text: z.string().min(5, 'Report text must be at least 5 characters'),
  venue_id: z.string().min(1).default('venue_demo_001'),
  floor: z.string().optional(),
  zone: z.string().optional(),
});

export interface DemoAnalyzeResponse {
  // Classification (Gemini Flash)
  crisis_type: string;
  severity: number;
  confidence: number;
  floor: string;
  zone: string;
  classification_reasoning: string;
  // Orchestration (Gemini Pro)
  dispatch_decisions: GeminiOrchestration['dispatch_decisions'];
  guest_notification: GeminiOrchestration['guest_notification'];
  control_room_summary: string;
  external_escalation: GeminiOrchestration['external_escalation'];
  decision_reasoning: string;
  orchestration_confidence: number;
}

export async function postDemoAnalyzeHandler(
  req: Request,
  res: Response<DemoAnalyzeResponse>
): Promise<void> {
  const parsed = analyzeBodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError({
      code: 'VALIDATION_ERROR',
      message: 'Invalid request body',
      httpStatus: 400,
      details: parsed.error.issues.map(i => ({ field: i.path.join('.'), issue: i.message })),
    });
  }

  const { report_text, venue_id, floor, zone } = parsed.data;

  logger.info('postDemoAnalyzeHandler: starting synchronous Gemini analysis', { venue_id });

  // Step 1: Classify the crisis with Gemini Flash (~1s)
  const classification = await classifyWithGemini(
    report_text,
    floor,
    zone,
    ['manual_report'],
  );

  // Step 2: Fetch available personnel for orchestration context
  // Falls back to demo staff if Firestore is unavailable (e.g. no GCP project configured locally)
  let personnel: Awaited<ReturnType<typeof personnelRepo.listAvailableResponders>> = [];
  try {
    personnel = await personnelRepo.listAvailableResponders(venue_id, []);
  } catch (err) {
    logger.warn('postDemoAnalyzeHandler: Firestore unavailable, using demo personnel', { err });
    personnel = [
      { staff_id: 'staff_001', name: 'Rajan Mehta',    role: 'fire_marshal',    floor: '2' },
      { staff_id: 'staff_002', name: 'Priya Nair',     role: 'medical_officer', floor: '3' },
      { staff_id: 'staff_003', name: 'Arun Kumar',     role: 'security',        floor: '1' },
      { staff_id: 'staff_004', name: 'Sunita Sharma',  role: 'security',        floor: '2' },
      { staff_id: 'staff_005', name: 'Deepak Verma',   role: 'medical_officer', floor: '1' },
      { staff_id: 'staff_006', name: 'Kavya Reddy',    role: 'fire_marshal',    floor: '4' },
    ];
  }

  // Step 3: Orchestrate the full response with Gemini Pro (~3s)
  const orchestration = await orchestrateWithGemini(
    {
      crisis_type: classification.crisis_type,
      severity: classification.severity,
      floor: classification.floor,
      zone: classification.zone,
      report_text,
    },
    {
      current_time: new Date().toISOString(),
      available_personnel: personnel.map(p => ({
        staff_id: p.staff_id,
        name: p.name ?? p.staff_id,
        role: p.role,
        floor: p.floor ?? 'unknown',
        certifications: p.certifications,
      })),
    }
  );

  logger.info('postDemoAnalyzeHandler: analysis complete', {
    crisis_type: classification.crisis_type,
    severity: classification.severity,
    dispatch_count: orchestration.dispatch_decisions.length,
    external_escalation: orchestration.external_escalation.required,
  });

  res.status(200).json({
    crisis_type: classification.crisis_type,
    severity: classification.severity,
    confidence: classification.confidence,
    floor: classification.floor,
    zone: classification.zone,
    classification_reasoning: classification.reasoning,
    dispatch_decisions: orchestration.dispatch_decisions,
    guest_notification: orchestration.guest_notification,
    control_room_summary: orchestration.control_room_summary,
    external_escalation: orchestration.external_escalation,
    decision_reasoning: orchestration.decision_reasoning,
    orchestration_confidence: orchestration.confidence,
  });
}
