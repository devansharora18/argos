import { z } from "zod";

export const eventEnvelopeSchema = z.object({
	schema_version: z.string().min(1),
	event_id: z.string().min(1),
	correlation_id: z.string().min(1),
	idempotency_key: z.string().min(1),
	crisis_id: z.string().min(1),
	tenant_id: z.string().min(1),
	venue_id: z.string().min(1),
	produced_at: z.string().datetime(),
});

export type EventEnvelope = z.infer<typeof eventEnvelopeSchema>;
