import { randomUUID } from 'crypto';
import { logger } from '../bootstrap/logger';
import { crisisCreatedEventSchema } from '../contracts/events/crisisEvents';
import { classifyWithGemini } from '../integrations/gemini/geminiClient';
import { analyseFrame, VisualFeatures } from '../integrations/vision/visionClient';
import { publishJson } from '../integrations/pubsub/publisher';
import { crisisRepo, CrisisRecord } from '../repositories/crisisRepo';
import { withRetry } from '../utils/retry';
import { decodePubSubData } from './pubsubUtils';

// ---------------------------------------------------------------------------
// Gemini-powered crisis classifier
// Replaces the previous regex-based classifyFromText stub.
// Gemini Flash is used for speed — target <2s classification latency.
// Falls back gracefully: if Gemini fails, pipeline logs and continues
// with an 'unknown' classification rather than hard-crashing.
// ---------------------------------------------------------------------------

async function classifyWithGeminiFallback(
  crisis: CrisisRecord,
  visualFeatures: VisualFeatures | null
): Promise<Pick<CrisisRecord, 'crisis_type' | 'severity' | 'confidence'> & {
  floor: string;
  zone: string;
  geminiReasoning: string;
}> {
  try {
    const result = await classifyWithGemini(
      crisis.report_text ?? '',
      crisis.floor,
      crisis.zone,
      crisis.trigger_sources,
      visualFeatures ?? undefined
    );

    return {
      crisis_type: result.crisis_type,
      severity: result.severity,
      confidence: result.confidence,
      floor: result.floor !== 'unknown' ? result.floor : crisis.floor,
      zone: result.zone !== 'unknown' ? result.zone : (crisis.zone ?? ''),
      geminiReasoning: result.reasoning,
    };
  } catch (err) {
    logger.error('classifyCrisisWorker: Gemini call failed, using safe fallback', {
      error: err instanceof Error ? err.message : String(err),
      crisis_id: crisis.crisis_id,
    });

    return {
      crisis_type: 'unknown',
      severity: 2,
      confidence: 0.4,
      floor: crisis.floor,
      zone: crisis.zone ?? '',
      geminiReasoning: 'Classification unavailable — Gemini call failed.',
    };
  }
}

export async function classifyCrisisWorker(event: unknown): Promise<void> {
  const payload = decodePubSubData(event);
  const parsed = crisisCreatedEventSchema.safeParse(payload);

  if (!parsed.success) {
    logger.warn('classifyCrisisWorker: invalid payload', {
      worker: 'classifyCrisis',
      error: parsed.error.flatten(),
    });
    return;
  }

  const message = parsed.data;

  const crisis = await withRetry(
    () => crisisRepo.getByIdInVenue(message.venue_id, message.crisis_id),
    { maxAttempts: 3 }
  );

  if (!crisis) {
    logger.warn('classifyCrisisWorker: crisis not found', {
      worker: 'classifyCrisis',
      crisis_id: message.crisis_id,
      venue_id: message.venue_id,
    });
    return;
  }

  // --- Visual analysis (Cloud Vision) — runs in parallel with Firestore fetch ---
  // frame_base64 is stored on the crisis document only when the Flutter app
  // attached a camera frame to the report. If absent, we skip Vision entirely.
  let visualFeatures: VisualFeatures | null = null;
  if (crisis.frame_base64) {
    visualFeatures = await analyseFrame(crisis.frame_base64);
    if (visualFeatures) {
      logger.info('classifyCrisisWorker: visual features extracted', {
        crisis_id: message.crisis_id,
        person_count: visualFeatures.person_count,
        crowd_density: visualFeatures.crowd_density,
        fire_smoke_signal: visualFeatures.fire_smoke_signal,
        security_signal: visualFeatures.security_signal,
      });
    }
  }

  // --- Gemini Flash classification (multi-modal: text + vision) ---
  const classification = await classifyWithGeminiFallback(crisis, visualFeatures);

  logger.info('classifyCrisisWorker: Gemini classification result', {
    crisis_id: message.crisis_id,
    crisis_type: classification.crisis_type,
    severity: classification.severity,
    confidence: classification.confidence,
    reasoning: classification.geminiReasoning,
  });

  // --- Persist to Firestore ---
  await withRetry(
    () =>
      crisisRepo.applyClassification({
        venueId: message.venue_id,
        crisisId: message.crisis_id,
        crisisType: classification.crisis_type,
        severity: classification.severity,
        confidence: classification.confidence,
        floor: classification.floor,
        zone: classification.zone,
        geminiReasoning: classification.geminiReasoning,
      }),
    { maxAttempts: 3 }
  );

  // --- Trigger orchestration stage ---
  await withRetry(
    () =>
      publishJson('orchestration.requested', {
        schema_version: 'v1',
        event_id: randomUUID(),
        correlation_id: message.correlation_id,
        idempotency_key: message.idempotency_key,
        crisis_id: message.crisis_id,
        tenant_id: message.tenant_id,
        venue_id: message.venue_id,
        produced_at: new Date().toISOString(),
        event_name: 'orchestration.requested',
        payload: {
          crisis_type: classification.crisis_type,
          severity: classification.severity,
          confidence: classification.confidence,
        },
      }),
    { maxAttempts: 3 }
  );

  logger.info('classifyCrisisWorker: complete', {
    worker: 'classifyCrisis',
    crisis_id: message.crisis_id,
    venue_id: message.venue_id,
    classification,
  });
}
