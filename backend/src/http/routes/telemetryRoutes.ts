import { Router } from 'express';
import { telemetryIngestBodySchema, telemetrySummaryQuerySchema } from '../../contracts/api/device';
import { getTelemetrySummaryHandler } from '../../handlers/telemetry/getTelemetrySummary';
import { postTelemetryHandler } from '../../handlers/telemetry/postTelemetry';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateBody } from '../middleware/validateBody';
import { validateQuery } from '../middleware/validateQuery';

export const telemetryRoutes = Router({ mergeParams: true });

telemetryRoutes.post(
  '/',
  validateBody(telemetryIngestBodySchema),
  asyncHandler(postTelemetryHandler)
);
telemetryRoutes.get(
  '/summary',
  validateQuery(telemetrySummaryQuerySchema),
  asyncHandler(getTelemetrySummaryHandler)
);
