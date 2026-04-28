import express from 'express';
import { config } from './config';
import { errorHandler, notFoundHandler } from '../http/middleware/errorHandler';
import { requestContextMiddleware } from '../http/middleware/requestContext';
import { crisisRoutes } from '../http/routes/crisisRoutes';
import { demoRoutes } from '../http/routes/demoRoutes';
import { healthRoutes } from '../http/routes/healthRoutes';
import { personnelRoutes } from '../http/routes/personnelRoutes';

export function createApp(): express.Express {
  const app = express();

  app.use(express.json({ limit: '2mb' }));
  app.use(requestContextMiddleware);

  app.use(`${config.apiPrefix}/crises`, crisisRoutes);
  app.use(`${config.apiPrefix}/personnel`, personnelRoutes);
  app.use(`${config.apiPrefix}/demo`, demoRoutes);
  app.use(`${config.apiPrefix}/health`, healthRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
