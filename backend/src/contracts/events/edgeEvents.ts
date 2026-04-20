import { z } from 'zod';
import { edgeDetectionEnvelopeSchema, edgeReplayBatchBodySchema } from '../api/device';

const edgeEventEnvelopeSchema = z.object({
  schema_version: z.string().min(1),
  event_id: z.string().min(1),
  correlation_id: z.string().min(1),
  idempotency_key: z.string().min(1),
  crisis_id: z.string().min(1),
  tenant_id: z.string().min(1),
  venue_id: z.string().min(1),
  produced_at: z.string().datetime(),
});

export const edgeDetectedEventSchema = edgeEventEnvelopeSchema.extend({
  event_name: z.literal('edge.detected'),
  payload: z.object({
    source: z.enum(['ingest', 'replay']),
    replay_batch_id: z.string().min(1).optional(),
    detection: edgeDetectionEnvelopeSchema,
  }),
});

export const edgeReplayRequestedEventSchema = edgeEventEnvelopeSchema.extend({
  event_name: z.literal('edge.replay.requested'),
  payload: z.object({
    batch: edgeReplayBatchBodySchema,
  }),
});

export type EdgeDetectedEvent = z.infer<typeof edgeDetectedEventSchema>;
export type EdgeReplayRequestedEvent = z.infer<typeof edgeReplayRequestedEventSchema>;
