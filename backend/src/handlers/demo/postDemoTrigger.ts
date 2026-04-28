import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { z } from 'zod';
import { config } from '../../bootstrap/config';
import { logger } from '../../bootstrap/logger';
import { CrisisCreatedEvent } from '../../contracts/events/crisisEvents';
import { publishJson } from '../../integrations/pubsub/publisher';
import { crisisRepo } from '../../repositories/crisisRepo';
import { AppError } from '../../utils/errors';

// ---------------------------------------------------------------------------
// POST /api/v1/demo/trigger
//
// Fires a pre-scripted crisis scenario through the full HAVEN pipeline.
// Used during live demos — no Firebase Auth required, protected by a
// static demo API key (x-demo-key header or DEMO_API_KEY env var).
//
// The endpoint creates a real CrisisDraft in Firestore and publishes
// crisis.created, so Gemini classification, orchestration, staff dispatch
// and guest notification all run exactly as they would in production.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Scenario library — five realistic hotel crisis reports
// ---------------------------------------------------------------------------

type Scenario = 'fire' | 'medical' | 'security' | 'stampede' | 'structural';

interface ScenarioScript {
  report_text: string;
  floor: string;
  zone: string;
  trigger_sources: string[];
}

const SCENARIOS: Record<Scenario, ScenarioScript> = {
  fire: {
    report_text:
      'Heavy smoke visible coming from the kitchen area. Fire alarm on floor 3 just triggered. ' +
      'Multiple guests evacuating the restaurant. Smell of burning, possible electrical fire.',
    floor: '3',
    zone: 'Kitchen / Restaurant',
    trigger_sources: ['smoke_sensor_3A', 'fire_alarm_3B', 'manual_report'],
  },
  medical: {
    report_text:
      'Guest collapsed near the swimming pool and is unresponsive. Bystanders performing CPR. ' +
      'No AED nearby. Approximately 60 years old male, no visible injuries.',
    floor: '2',
    zone: 'Pool Deck',
    trigger_sources: ['manual_report', 'panic_button_2C'],
  },
  security: {
    report_text:
      'Violent altercation in the main lobby between two guests. One person appears to have ' +
      'a weapon. Multiple guests frightened and backing away. Situation escalating.',
    floor: '1',
    zone: 'Main Lobby',
    trigger_sources: ['cctv_alert_1A', 'manual_report'],
  },
  stampede: {
    report_text:
      'Crowd surge at the Grand Ballroom entrance. People are being crushed against the doors. ' +
      'Several guests have fallen. Estimated 200+ people in the area. Someone shouted fire.',
    floor: '1',
    zone: 'Grand Ballroom',
    trigger_sources: ['crowd_density_sensor_1D', 'panic_button_1E', 'manual_report'],
  },
  structural: {
    report_text:
      'Part of the ceiling in Corridor A has collapsed. Dust and debris everywhere. ' +
      'Two guests may be trapped under rubble. Structural cracking sounds still audible.',
    floor: '4',
    zone: 'Corridor A',
    trigger_sources: ['vibration_sensor_4A', 'manual_report'],
  },
};

// ---------------------------------------------------------------------------
// Request schema
// ---------------------------------------------------------------------------

const triggerBodySchema = z.object({
  scenario: z.enum(['fire', 'medical', 'security', 'stampede', 'structural']),
  venue_id: z.string().min(1).default('venue_demo_001'),
  // Optional overrides — useful for custom demos
  floor_override: z.string().optional(),
  zone_override: z.string().optional(),
  extra_context: z.string().optional(),
});

export type DemoTriggerBody = z.infer<typeof triggerBodySchema>;

export interface DemoTriggerResponse {
  crisis_id: string;
  venue_id: string;
  scenario: Scenario;
  floor: string;
  zone: string;
  report_text: string;
  pipeline_started: true;
  message: string;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function postDemoTriggerHandler(
  req: Request,
  res: Response<DemoTriggerResponse>
): Promise<void> {
  // --- Demo key guard ---
  const providedKey =
    (req.headers['x-demo-key'] as string | undefined) ?? req.body?.demo_key;

  if (!config.authDisabled && providedKey !== config.demoApiKey) {
    throw new AppError({
      code: 'FORBIDDEN',
      message: 'Invalid or missing demo key. Set x-demo-key header.',
      httpStatus: 403,
    });
  }

  // --- Parse + validate body ---
  const parsed = triggerBodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError({
      code: 'VALIDATION_ERROR',
      message: 'Invalid demo trigger body',
      httpStatus: 400,
      details: parsed.error.issues.map(i => ({ field: i.path.join('.'), issue: i.message })),
    });
  }

  const { scenario, venue_id, floor_override, zone_override, extra_context } = parsed.data;
  const script = SCENARIOS[scenario];

  const floor = floor_override ?? script.floor;
  const zone  = zone_override  ?? script.zone;
  const reportText =
    extra_context
      ? `${script.report_text} Additional context: ${extra_context}`
      : script.report_text;

  // --- Build crisis draft ---
  const crisisId     = randomUUID();
  const correlationId = randomUUID();
  const idempotencyKey = `demo-${scenario}-${Date.now()}`;
  const now          = new Date().toISOString();

  const crisisDraft = {
    crisis_id: crisisId,
    tenant_id: 'tenant_demo_001',
    venue_id,
    crisis_type: 'unknown' as const,
    severity: 1,
    confidence: 0,
    floor,
    zone,
    status: 'detected' as const,
    detected_at: now,
    trigger_sources: script.trigger_sources,
    report_text: reportText,
    created_by: {
      actor_id: 'demo_system',
      role: 'system',
    },
    schema_version: 'v1',
  };

  await crisisRepo.createDraft(crisisDraft);

  // --- Publish crisis.created to kick off the full pipeline ---
  const crisisCreatedEvent: CrisisCreatedEvent = {
    schema_version: 'v1',
    event_id: randomUUID(),
    correlation_id: correlationId,
    idempotency_key: idempotencyKey,
    crisis_id: crisisId,
    tenant_id: 'tenant_demo_001',
    venue_id,
    produced_at: now,
    event_name: 'crisis.created',
    payload: {
      status: 'detected',
      floor,
      zone,
      trigger_sources: script.trigger_sources,
    },
  };

  await publishJson('crisis.created', crisisCreatedEvent);

  logger.info('postDemoTriggerHandler: demo crisis triggered', {
    crisis_id: crisisId,
    scenario,
    venue_id,
    floor,
    zone,
  });

  res.status(201).json({
    crisis_id: crisisId,
    venue_id,
    scenario,
    floor,
    zone,
    report_text: reportText,
    pipeline_started: true,
    message: `Demo crisis created. Watch Firestore: venues/${venue_id}/crises/${crisisId}`,
  });
}
