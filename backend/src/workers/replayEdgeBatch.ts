import { EdgeDetectionEnvelope } from '../contracts/api/device';
import { edgeReplayRequestedEventSchema } from '../contracts/events/edgeEvents';
import { logger } from '../bootstrap/logger';
import { processEdgeDetection } from '../services/edgeIngestionService';
import { decodePubSubData } from './pubsubUtils';
import { edgeRepo } from '../repositories/edgeRepo';
import { AppError } from '../utils/errors';

function sortDetections(detections: EdgeDetectionEnvelope[]): EdgeDetectionEnvelope[] {
  return [...detections].sort((left, right) => {
    const leftDetectedAt = Date.parse(left.detected_at);
    const rightDetectedAt = Date.parse(right.detected_at);
    if (leftDetectedAt !== rightDetectedAt) {
      return leftDetectedAt - rightDetectedAt;
    }

    const leftSequence = left.sequence_number ?? 0;
    const rightSequence = right.sequence_number ?? 0;
    return leftSequence - rightSequence;
  });
}

export async function replayEdgeBatchWorker(event: unknown): Promise<void> {
  const payload = decodePubSubData(event);
  const parsed = edgeReplayRequestedEventSchema.safeParse(payload);
  if (!parsed.success) {
    logger.warn('replayEdgeBatchWorker received invalid payload', {
      worker: 'replayEdgeBatch',
      error: parsed.error.flatten(),
    });
    return;
  }

  const message = parsed.data;
  const originalOrder = message.payload.batch.detections.map(detection => detection.detection_id);
  const sortedDetections = sortDetections(message.payload.batch.detections);
  const outOfOrderCount = sortedDetections.reduce((count, detection, index) => {
    return detection.detection_id === originalOrder[index] ? count : count + 1;
  }, 0);

  let processedCount = 0;
  let duplicateCount = 0;
  let failedCount = 0;

  for (const detection of sortedDetections) {
    try {
      const result = await processEdgeDetection({
        detection,
        correlationId: message.correlation_id,
        idempotencyKey: `${message.idempotency_key}:${detection.detection_id}`,
        tenantId: message.tenant_id,
        source: 'replay',
        replayBatchId: message.payload.batch.batch_id,
      });

      if (result.duplicate) {
        duplicateCount += 1;
      } else {
        processedCount += 1;
      }
    } catch (error) {
      failedCount += 1;
      logger.error('replayEdgeBatchWorker failed detection', {
        worker: 'replayEdgeBatch',
        detection_id: detection.detection_id,
        venue_id: detection.venue_id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  await edgeRepo.recordReplayBatchResult({
    batchId: message.payload.batch.batch_id,
    venueId: message.payload.batch.venue_id,
    total: message.payload.batch.detections.length,
    processed: processedCount,
    duplicates: duplicateCount,
    failed: failedCount,
    outOfOrder: outOfOrderCount,
    correlationId: message.correlation_id,
  });

  logger.info('replayEdgeBatchWorker completed batch', {
    worker: 'replayEdgeBatch',
    batch_id: message.payload.batch.batch_id,
    venue_id: message.payload.batch.venue_id,
    total: message.payload.batch.detections.length,
    processed: processedCount,
    duplicates: duplicateCount,
    failed: failedCount,
    out_of_order: outOfOrderCount,
  });

  if (failedCount > 0) {
    throw new AppError({
      code: 'EDGE_REPLAY_PARTIAL_FAILURE',
      message: 'Edge replay batch had one or more failed detections',
      httpStatus: 500,
      retryable: true,
    });
  }
}
