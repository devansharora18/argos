import { Request, Response } from 'express';
import { getActorFromRequest } from '../../auth/verifyFirebaseToken';
import { requireRole, requireVenueScope } from '../../auth/roleGuard';
import { GetDeviceResponse } from '../../contracts/api/device';
import { deviceRepo } from '../../repositories/deviceRepo';
import { AppError } from '../../utils/errors';

export async function getDeviceHandler(
  req: Request<{ venueId: string; deviceId: string }, GetDeviceResponse>,
  res: Response<GetDeviceResponse>
): Promise<void> {
  const actor = await getActorFromRequest(req);
  requireRole(actor, ['staff', 'manager', 'admin']);

  const venueId = req.params.venueId;
  requireVenueScope(actor, venueId);

  const device = await deviceRepo.getById(venueId, req.params.deviceId);
  if (!device) {
    throw new AppError({
      code: 'RESOURCE_NOT_FOUND',
      message: 'Device not found',
      httpStatus: 404,
    });
  }

  res.status(200).json({
    venue_id: venueId,
    device,
  });
}
