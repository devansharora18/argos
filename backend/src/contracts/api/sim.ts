import { z } from 'zod';

export const simTriggerBodySchema = z.object({
  crisis_type: z.enum(['fire', 'medical', 'security', 'stampede', 'structural', 'smoke', 'flood']),
  severity: z.number().int().min(1).max(5),
  venue_id: z.string().min(1).default('venue_demo'),
  zone: z.string().min(1).default('Floor 3 — East Wing'),
  floor: z.string().optional(),
  description: z.string().min(1),
  reported_by: z.string().optional(),
});

export type SimTriggerBody = z.infer<typeof simTriggerBodySchema>;
