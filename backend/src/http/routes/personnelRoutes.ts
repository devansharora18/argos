import { Router } from 'express';
import { getMeQuerySchema, patchMyStatusBodySchema } from '../../contracts/api/personnel';
import { getMeHandler } from '../../handlers/personnel/getMe';
import { patchMyStatusHandler } from '../../handlers/personnel/patchMyStatus';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateBody } from '../middleware/validateBody';
import { validateQuery } from '../middleware/validateQuery';

export const personnelRoutes = Router();

personnelRoutes.get('/me', validateQuery(getMeQuerySchema), asyncHandler(getMeHandler));
personnelRoutes.patch(
  '/me/status',
  validateBody(patchMyStatusBodySchema),
  asyncHandler(patchMyStatusHandler)
);
