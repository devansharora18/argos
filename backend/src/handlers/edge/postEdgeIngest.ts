import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { getActorFromRequest } from '../../auth/verifyFirebaseToken';
import { requireRole } from '../../auth/roleGuard';
import { config } from '../../bootstrap/config';
import { EdgeDetectionEnvelope, EdgeIngestResponse } from '../../contracts/api/device';
import { EdgeDetectedEvent } from '../../contracts/events/edgeEvents';
import { RequestLocals } from '../../http/middleware/context';
import { publishJson } from '../../integrations/pubsub/publisher';
import { idempotencyRepo } from '../../repositories/idempotencyRepo';
import { AppError } from '../../utils/errors';
import { requestHash } from '../../utils/requestHash';

export async function postEdgeIngestHandler(
  req: Request<Record<string, string>, EdgeIngestResponse, EdgeDetectionEnvelope>,
  res: Response<EdgeIngestResponse>
): Promise<void> {
  const actor = await getActorFromRequest(req);
  requireRole(actor, ['service']);

  const locals = res.locals as RequestLocals;
  const { correlationId, idempotencyKey } = locals.ctx;
  if (!idempotencyKey) {
    throw new AppError({
      code: 'MISSING_IDEMPOTENCY_KEY',
      message: 'Idempotency-Key header is required',
      httpStatus: 400,
    });
  }

  const result = await idempotencyRepo.executeOnce<EdgeIngestResponse>(
    {
      scope: 'edge.ingest',
      actorId: actor.uid,
      idempotencyKey,
      requestHash: requestHash({ path: req.path, actor: actor.uid, body: req.body }),
      ttlHours: config.idempotencyTtlHours,
    },
    async () => {
      const event: EdgeDetectedEvent = {
        schema_version: 'v1',
        event_id: randomUUID(),
        correlation_id: correlationId,
        idempotency_key: idempotencyKey,
        crisis_id: req.body.detection_id,
        tenant_id: actor.tenantId,
        venue_id: req.body.venue_id,
        produced_at: new Date().toISOString(),
        event_name: 'edge.detected',
        payload: {
          source: 'ingest',
          detection: req.body,
        },
      };

      await publishJson('edge.detected', event);

      return {
        accepted: true,
        detection_id: req.body.detection_id,
        correlation_id: correlationId,
      };
    }
  );

  res.status(result.replayed ? 200 : 201).json(result.response);
}
