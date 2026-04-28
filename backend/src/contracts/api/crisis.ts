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
    // Base64-encoded audio sent directly from Flutter app.
    // Transcribed server-side via Google Speech-to-Text before pipeline entry.
    audio_base64: z.string().min(1).optional(),
    audio_encoding: z.enum(['WEBM_OPUS', 'LINEAR16', 'MP3', 'FLAC', 'OGG_OPUS']).optional(),
    audio_sample_rate: z.number().int().positive().optional(),
    // Base64-encoded camera frame for Cloud Vision analysis.
    // Optional — classification proceeds without it.
    frame_base64: z.string().min(1).optional(),
    trigger_sources: z.array(z.string().min(1)).default([]),
  })
  .refine(data => Boolean(data.report_text || data.audio_uri || data.audio_base64), {
    message: 'One of report_text, audio_uri, or audio_base64 is required',
    path: ['report_text'],
  });

export type PostReportBody = z.infer<typeof postReportBodySchema>;

export interface PostReportResponse {
  crisis_id: string;
  status: 'detected';
  correlation_id: string;
}
