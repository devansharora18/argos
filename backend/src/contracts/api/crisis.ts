import { z } from 'zod';

export const crisisTypeSchema = z.enum([
  'fire',
  'medical',
  'security',
  'stampede',
  'structural',
  'unknown',
]);

export const crisisStatusSchema = z.enum([
  'detected',
  'classified',
  'dispatched',
  'active',
  'resolved',
  'false_alarm',
]);

export const postReportBodySchema = z
  .object({
    venue_id: z.string().min(1),
    floor: z.string().min(1),
    zone: z.string().min(1).optional(),
    report_text: z.string().min(1).optional(),
    audio_uri: z.string().url().optional(),
    trigger_sources: z.array(z.string().min(1)).default([]),
  })
  .refine(data => Boolean(data.report_text || data.audio_uri), {
    message: 'Either report_text or audio_uri is required',
    path: ['report_text'],
  });

export type PostReportBody = z.infer<typeof postReportBodySchema>;

export interface PostReportResponse {
  crisis_id: string;
  status: 'detected';
  correlation_id: string;
}
