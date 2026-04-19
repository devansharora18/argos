import { z } from 'zod';
import { eventEnvelopeSchema } from './common';

export const orchestrationRequestedEventSchema = eventEnvelopeSchema.extend({
  event_name: z.literal('orchestration.requested'),
  payload: z.object({
    crisis_type: z.enum(['fire', 'medical', 'security', 'stampede', 'structural', 'unknown']),
    severity: z.number().int().min(1).max(5),
    confidence: z.number().min(0).max(1),
  }),
});

export const dispatchRequestedEventSchema = eventEnvelopeSchema.extend({
  event_name: z.literal('dispatch.requested'),
  payload: z.object({
    dispatch_id: z.string().min(1),
    staff_id: z.string().min(1),
  }),
});

export type OrchestrationRequestedEvent = z.infer<typeof orchestrationRequestedEventSchema>;
export type DispatchRequestedEvent = z.infer<typeof dispatchRequestedEventSchema>;
