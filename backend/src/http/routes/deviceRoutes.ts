import { Router } from 'express';
import {
  deviceHeartbeatBodySchema,
  listDevicesQuerySchema,
  registerDeviceBodySchema,
} from '../../contracts/api/device';
import { getDeviceHandler } from '../../handlers/devices/getDevice';
import { listDevicesHandler } from '../../handlers/devices/listDevices';
import { postDeviceHeartbeatHandler } from '../../handlers/devices/postHeartbeat';
import { registerDeviceHandler } from '../../handlers/devices/registerDevice';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateBody } from '../middleware/validateBody';
import { validateQuery } from '../middleware/validateQuery';

export const deviceRoutes = Router({ mergeParams: true });

deviceRoutes.post('/', validateBody(registerDeviceBodySchema), asyncHandler(registerDeviceHandler));
deviceRoutes.get('/', validateQuery(listDevicesQuerySchema), asyncHandler(listDevicesHandler));
deviceRoutes.get('/:deviceId', asyncHandler(getDeviceHandler));
deviceRoutes.post(
  '/:deviceId/heartbeat',
  validateBody(deviceHeartbeatBodySchema),
  asyncHandler(postDeviceHeartbeatHandler)
);
