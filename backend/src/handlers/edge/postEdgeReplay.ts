import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { getActorFromRequest } from '../../auth/verifyFirebaseToken';
import { requireRole } from '../../auth/roleGuard';
import { config } from '../../bootstrap/config';
import { EdgeReplayBatchBody, EdgeReplayResponse } from '../../contracts/api/device';
import { EdgeReplayRequestedEvent } from '../../contracts/events/edgeEvents';
import { RequestLocals } from '../../http/middleware/context';
import { publishJson } from '../../integrations/pubsub/publisher';
import { idempotencyRepo } from '../../repositories/idempotencyRepo';
import { AppError } from '../../utils/errors';
import { requestHash } from '../../utils/requestHash';

export async function postEdgeReplayHandler(
  req: Request<Record<string, string>, EdgeReplayResponse, EdgeReplayBatchBody>,
  res: Response<EdgeReplayResponse>
): Promise<void> {
  const actor = await getActorFromRequest(req);
  requireRole(actor, ['service']);

  if (req.body.detections.length > config.edgeReplayMaxBatchSize) {
    throw new AppError({
      code: 'EDGE_REPLAY_BATCH_TOO_LARGE',
      message: `Replay batch exceeds max size of ${config.edgeReplayMaxBatchSize}`,
      httpStatus: 400,
    });
  }

  const locals = res.locals as RequestLocals;
  const { correlationId, idempotencyKey } = locals.ctx;
  if (!idempotencyKey) {
    throw new AppError({
      code: 'MISSING_IDEMPOTENCY_KEY',
      message: 'Idempotency-Key header is required',
      httpStatus: 400,
    });
  }

  const result = await idempotencyRepo.executeOnce<EdgeReplayResponse>(
    {
      scope: 'edge.replay',
      actorId: actor.uid,
      idempotencyKey,
      requestHash: requestHash({ path: req.path, actor: actor.uid, body: req.body }),
      ttlHours: config.idempotencyTtlHours,
    },
    async () => {
      const event: EdgeReplayRequestedEvent = {
        schema_version: 'v1',
        event_id: randomUUID(),
        correlation_id: correlationId,
        idempotency_key: idempotencyKey,
        crisis_id: req.body.batch_id,
        tenant_id: actor.tenantId,
        venue_id: req.body.venue_id,
        produced_at: new Date().toISOString(),
        event_name: 'edge.replay.requested',
        payload: {
          batch: req.body,
        },
      };

      await publishJson('edge.replay.requested', event);

      return {
        accepted: true,
        batch_id: req.body.batch_id,
        detection_count: req.body.detections.length,
        correlation_id: correlationId,
      };
    }
  );

  res.status(result.replayed ? 200 : 201).json(result.response);
}
