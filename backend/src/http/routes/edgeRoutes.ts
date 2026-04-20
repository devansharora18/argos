import { Router } from 'express';
import { edgeDetectionEnvelopeSchema, edgeReplayBatchBodySchema } from '../../contracts/api/device';
import { postEdgeIngestHandler } from '../../handlers/edge/postEdgeIngest';
import { postEdgeReplayHandler } from '../../handlers/edge/postEdgeReplay';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateBody } from '../middleware/validateBody';

export const edgeRoutes = Router();

edgeRoutes.post(
  '/ingest',
  validateBody(edgeDetectionEnvelopeSchema),
  asyncHandler(postEdgeIngestHandler)
);
edgeRoutes.post(
  '/replay',
  validateBody(edgeReplayBatchBodySchema),
  asyncHandler(postEdgeReplayHandler)
);
