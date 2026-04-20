import { Request, Response } from 'express';
import { getActorFromRequest } from '../../auth/verifyFirebaseToken';
import { requireRole, requireVenueScope } from '../../auth/roleGuard';
import {
  RegisterDeviceBody,
  RegisterDeviceResponse,
  DeviceResponse,
} from '../../contracts/api/device';
import { RequestLocals } from '../../http/middleware/context';
import { deviceRepo } from '../../repositories/deviceRepo';

export async function registerDeviceHandler(
  req: Request<{ venueId: string }, RegisterDeviceResponse, RegisterDeviceBody>,
  res: Response<RegisterDeviceResponse>
): Promise<void> {
  const actor = await getActorFromRequest(req);
  requireRole(actor, ['manager', 'admin']);

  const venueId = req.params.venueId;
  requireVenueScope(actor, venueId);

  const device = await deviceRepo.registerDevice({
    venueId,
    body: req.body,
    actorId: actor.uid,
  });

  const locals = res.locals as RequestLocals;
  res.status(201).json({
    device: device as DeviceResponse,
    correlation_id: locals.ctx.correlationId,
  });
}
