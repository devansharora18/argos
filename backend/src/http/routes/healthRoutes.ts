import { Router } from 'express';
import { getHealthHandler } from '../../handlers/health/getHealth';
import { asyncHandler } from '../../utils/asyncHandler';

export const healthRoutes = Router();

healthRoutes.get('/', asyncHandler(getHealthHandler));
