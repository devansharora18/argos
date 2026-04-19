import { z } from 'zod';
import { eventEnvelopeSchema } from './common';

export const crisisCreatedEventSchema = eventEnvelopeSchema.extend({
  event_name: z.literal('crisis.created'),
  payload: z.object({
    status: z.literal('detected'),
    floor: z.string().min(1),
    zone: z.string().optional(),
    trigger_sources: z.array(z.string()),
  }),
});

export type CrisisCreatedEvent = z.infer<typeof crisisCreatedEventSchema>;
