import { Router } from 'express';
import { simTriggerBodySchema } from '../../contracts/api/sim';
import { getEventsStreamHandler } from '../../handlers/sim/getEvents';
import { postSimTriggerHandler } from '../../handlers/sim/postTrigger';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateBody } from '../middleware/validateBody';

export const simRoutes = Router();

simRoutes.post('/trigger', validateBody(simTriggerBodySchema), asyncHandler(postSimTriggerHandler));
simRoutes.get('/events/stream', getEventsStreamHandler);
