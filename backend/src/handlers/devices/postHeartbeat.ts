import { Request, Response } from 'express';
import { getActorFromRequest } from '../../auth/verifyFirebaseToken';
import { requireRole, requireVenueScope } from '../../auth/roleGuard';
import { DeviceHeartbeatBody, DeviceHeartbeatResponse } from '../../contracts/api/device';
import { RequestLocals } from '../../http/middleware/context';
import { deviceRepo } from '../../repositories/deviceRepo';

export async function postDeviceHeartbeatHandler(
  req: Request<{ venueId: string; deviceId: string }, DeviceHeartbeatResponse, DeviceHeartbeatBody>,
  res: Response<DeviceHeartbeatResponse>
): Promise<void> {
  const actor = await getActorFromRequest(req);
  requireRole(actor, ['service', 'manager', 'admin']);

  const venueId = req.params.venueId;
  requireVenueScope(actor, venueId);

  const device = await deviceRepo.updateHeartbeat({
    venueId,
    deviceId: req.params.deviceId,
    heartbeat: req.body,
  });

  const locals = res.locals as RequestLocals;
  res.status(200).json({
    venue_id: venueId,
    device_id: device.device_id,
    status: device.status,
    last_seen_at: device.last_seen_at,
    correlation_id: locals.ctx.correlationId,
  });
}
