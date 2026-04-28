import { Request, Response } from 'express';
import { getActorFromRequest } from '../../auth/verifyFirebaseToken';
import { requireRole, requireVenueScope } from '../../auth/roleGuard';
import { ListDevicesQuery, ListDevicesResponse } from '../../contracts/api/device';
import { deviceRepo } from '../../repositories/deviceRepo';

export async function listDevicesHandler(
  req: Request,
  res: Response<ListDevicesResponse>
): Promise<void> {
  const actor = await getActorFromRequest(req);
  requireRole(actor, ['staff', 'manager', 'admin']);

  const venueId = req.params.venueId;
  if (!venueId) {
    res.status(400).json({ error: 'venueId is required' } as any);
    return;
  }
  requireVenueScope(actor, venueId);

  const query = req.query as unknown as ListDevicesQuery;
  const devices = await deviceRepo.listDevices(venueId, query);
  res.status(200).json({
    venue_id: venueId,
    devices,
  });
}
