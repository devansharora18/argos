import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { config } from '../../bootstrap/config';
import { getActorFromRequest } from '../../auth/verifyFirebaseToken';
import { requireRole, requireVenueScope } from '../../auth/roleGuard';
import { PostReportBody, PostReportResponse } from '../../contracts/api/crisis';
import { CrisisCreatedEvent } from '../../contracts/events/crisisEvents';
import { RequestLocals } from '../../http/middleware/context';
import { transcribeAudio, AudioEncoding } from '../../integrations/speech/speechToText';
import { publishJson } from '../../integrations/pubsub/publisher';
import { crisisRepo } from '../../repositories/crisisRepo';
import { idempotencyRepo } from '../../repositories/idempotencyRepo';
import { createDraftFromReport } from '../../services/crisisService';
import { AppError } from '../../utils/errors';
import { requestHash } from '../../utils/requestHash';
import { logger } from '../../bootstrap/logger';

// ---------------------------------------------------------------------------
// POST /api/v1/crises/report
//
// Accepts a crisis report from a guest or staff member.
// If audio_base64 is provided, it is transcribed via Google Speech-to-Text
// before the crisis draft is created — so Gemini always has text to classify.
// ---------------------------------------------------------------------------

export async function postReportHandler(
  req: Request<Record<string, string>, PostReportResponse, PostReportBody>,
  res: Response<PostReportResponse>
): Promise<void> {
  const actor = await getActorFromRequest(req);
  requireRole(actor, ['guest', 'staff', 'manager']);

  const body = req.body;
  requireVenueScope(actor, body.venue_id);

  const locals = res.locals as RequestLocals;
  const { correlationId, idempotencyKey } = locals.ctx;

  if (!idempotencyKey) {
    throw new AppError({
      code: 'MISSING_IDEMPOTENCY_KEY',
      message: 'Idempotency-Key header is required',
      httpStatus: 400,
    });
  }

  // ---------------------------------------------------------------------------
  // Speech-to-Text transcription
  // If the client sent audio_base64, transcribe it now so report_text is
  // always populated before the draft hits Firestore and the pipeline.
  // ---------------------------------------------------------------------------
  let resolvedReportText = body.report_text;

  if (body.audio_base64 && !resolvedReportText) {
    logger.info('postReportHandler: audio_base64 received — transcribing', {
      venue_id: body.venue_id,
      floor: body.floor,
      encoding: body.audio_encoding ?? 'WEBM_OPUS',
    });

    const transcription = await transcribeAudio(
      body.audio_base64,
      (body.audio_encoding as AudioEncoding) ?? 'WEBM_OPUS',
      body.audio_sample_rate ?? 48000
    );

    if (transcription) {
      resolvedReportText = transcription.transcript;
      logger.info('postReportHandler: transcription succeeded', {
        transcript: resolvedReportText,
        confidence: transcription.confidence,
      });
    } else {
      // Transcription failed — allow pipeline to continue with empty text.
      // Gemini classifier handles empty text gracefully with low confidence.
      logger.warn('postReportHandler: transcription returned null — continuing without text', {
        venue_id: body.venue_id,
        floor: body.floor,
      });
    }
  }

  // Merge transcribed text back into body for downstream use
  const enrichedBody: PostReportBody = {
    ...body,
    report_text: resolvedReportText,
  };

  // ---------------------------------------------------------------------------
  // Idempotent crisis creation + pipeline trigger
  // ---------------------------------------------------------------------------
  const result = await idempotencyRepo.executeOnce<PostReportResponse>(
    {
      scope: 'crisis.report',
      actorId: actor.uid,
      idempotencyKey,
      requestHash: requestHash({ path: req.path, actor: actor.uid, body }),
      ttlHours: config.idempotencyTtlHours,
    },
    async () => {
      const crisisDraft = createDraftFromReport(enrichedBody, actor);
      await crisisRepo.createDraft(crisisDraft);

      const crisisCreatedEvent: CrisisCreatedEvent = {
        schema_version: 'v1',
        event_id: randomUUID(),
        correlation_id: correlationId,
        idempotency_key: idempotencyKey,
        crisis_id: crisisDraft.crisis_id,
        tenant_id: actor.tenantId,
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

      await publishJson('crisis.created', crisisCreatedEvent);

      return {
        crisis_id: crisisDraft.crisis_id,
        status: 'detected',
        correlation_id: correlationId,
      };
    }
  );

  res.status(result.replayed ? 200 : 201).json(result.response);
}
