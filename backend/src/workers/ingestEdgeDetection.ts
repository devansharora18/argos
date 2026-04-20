import { logger } from '../bootstrap/logger';
import { edgeDetectedEventSchema } from '../contracts/events/edgeEvents';
import { processEdgeDetection } from '../services/edgeIngestionService';
import { decodePubSubData } from './pubsubUtils';

export async function ingestEdgeDetectionWorker(event: unknown): Promise<void> {
  const payload = decodePubSubData(event);
  const parsed = edgeDetectedEventSchema.safeParse(payload);
  if (!parsed.success) {
    logger.warn('ingestEdgeDetectionWorker received invalid payload', {
      worker: 'ingestEdgeDetection',
      error: parsed.error.flatten(),
    });
    return;
  }

  const message = parsed.data;
  const result = await processEdgeDetection({
    detection: message.payload.detection,
    correlationId: message.correlation_id,
    idempotencyKey: message.idempotency_key,
    tenantId: message.tenant_id,
    source: message.payload.source,
    replayBatchId: message.payload.replay_batch_id,
  });

  logger.info('ingestEdgeDetectionWorker processed detection', {
    worker: 'ingestEdgeDetection',
    venue_id: message.venue_id,
    detection_id: message.payload.detection.detection_id,
    crisis_id: result.crisisId,
    duplicate: result.duplicate,
  });
}
