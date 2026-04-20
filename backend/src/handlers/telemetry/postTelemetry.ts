import { Request, Response } from 'express';
import { getActorFromRequest } from '../../auth/verifyFirebaseToken';
import { requireRole, requireVenueScope } from '../../auth/roleGuard';
import { TelemetryIngestBody, TelemetryIngestResponse } from '../../contracts/api/device';
import { RequestLocals } from '../../http/middleware/context';
import { deviceRepo } from '../../repositories/deviceRepo';
import { telemetryRepo } from '../../repositories/telemetryRepo';
import { AppError } from '../../utils/errors';
import { normalizeTelemetryBatch } from '../../services/telemetryService';

export async function postTelemetryHandler(
  req: Request<{ venueId: string }, TelemetryIngestResponse, TelemetryIngestBody>,
  res: Response<TelemetryIngestResponse>
): Promise<void> {
  const actor = await getActorFromRequest(req);
  requireRole(actor, ['service', 'manager', 'admin']);

  const venueId = req.params.venueId;
  requireVenueScope(actor, venueId);

  const device = await deviceRepo.getById(venueId, req.body.device_id);
  if (!device) {
    throw new AppError({
      code: 'RESOURCE_NOT_FOUND',
      message: 'Telemetry device not found',
      httpStatus: 404,
    });
  }

  const readings = normalizeTelemetryBatch(req.body);
  await telemetryRepo.writeReadings(venueId, readings);

  const locals = res.locals as RequestLocals;
  res.status(202).json({
    accepted: true,
    venue_id: venueId,
    device_id: req.body.device_id,
    ingested_count: readings.length,
    correlation_id: locals.ctx.correlationId,
  });
}
