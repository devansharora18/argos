import { randomUUID } from 'crypto';
import { CrisisCreatedEvent } from '../contracts/events/crisisEvents';
import { EdgeDetectionEnvelope } from '../contracts/api/device';
import { edgeRepo } from '../repositories/edgeRepo';
import { crisisRepo } from '../repositories/crisisRepo';
import { publishJson } from '../integrations/pubsub/publisher';
import { createDraftFromEdgeDetection } from './crisisService';
import { AppError } from '../utils/errors';

interface ProcessEdgeDetectionInput {
  detection: EdgeDetectionEnvelope;
  correlationId: string;
  idempotencyKey: string;
  tenantId: string;
  source: 'ingest' | 'replay';
  replayBatchId?: string;
}

export interface ProcessEdgeDetectionResult {
  duplicate: boolean;
  crisisId: string;
}

export async function processEdgeDetection(
  input: ProcessEdgeDetectionInput
): Promise<ProcessEdgeDetectionResult> {
  const reservation = await edgeRepo.beginDetection({
    detectionId: input.detection.detection_id,
    venueId: input.detection.venue_id,
    deviceId: input.detection.device_id,
    detectedAt: input.detection.detected_at,
    source: input.source,
    correlationId: input.correlationId,
  });

  if (reservation.duplicate) {
    if (!reservation.crisisId) {
      throw new AppError({
        code: 'EDGE_DUPLICATE_WITHOUT_RESULT',
        message: 'Duplicate edge detection did not include an existing crisis mapping',
        httpStatus: 500,
        retryable: true,
      });
    }

    return {
      duplicate: true,
      crisisId: reservation.crisisId,
    };
  }

  try {
    const crisisDraft = createDraftFromEdgeDetection(
      input.detection,
      input.tenantId,
      'edge-service'
    );
    await crisisRepo.createDraft(crisisDraft);

    const event: CrisisCreatedEvent = {
      schema_version: 'v1',
      event_id: randomUUID(),
      correlation_id: input.correlationId,
      idempotency_key: input.idempotencyKey,
      crisis_id: crisisDraft.crisis_id,
      tenant_id: input.tenantId,
      venue_id: crisisDraft.venue_id,
      produced_at: new Date().toISOString(),
      event_name: 'crisis.created',
      payload: {
        status: 'detected',
        floor: crisisDraft.floor,
        zone: crisisDraft.zone,
        trigger_sources: crisisDraft.trigger_sources,
      },
    };

    await publishJson('crisis.created', event);

    await edgeRepo.completeDetection({
      detectionId: input.detection.detection_id,
      crisisId: crisisDraft.crisis_id,
    });

    return {
      duplicate: false,
      crisisId: crisisDraft.crisis_id,
    };
  } catch (error) {
    await edgeRepo.abandonDetection(input.detection.detection_id);
    throw error;
  }
}
