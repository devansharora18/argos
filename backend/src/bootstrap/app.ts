import path from 'path';
import express from 'express';
import { config } from './config';
import { errorHandler, notFoundHandler } from '../http/middleware/errorHandler';
import { requestContextMiddleware } from '../http/middleware/requestContext';
import { crisisRoutes } from '../http/routes/crisisRoutes';
import { demoRoutes } from '../http/routes/demoRoutes';
import { deviceRoutes } from '../http/routes/deviceRoutes';
import { edgeRoutes } from '../http/routes/edgeRoutes';
import { healthRoutes } from '../http/routes/healthRoutes';
import { personnelRoutes } from '../http/routes/personnelRoutes';
import { simRoutes } from '../http/routes/simRoutes';
import { telemetryRoutes } from '../http/routes/telemetryRoutes';

export function createApp(): express.Express {
  const app = express();

  app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

https://github.com/devansharora18/argos/pull/13/conflict?name=backend%252Fsrc%252Findex.ts&ancestor_oid=2064c0cfd9ac834f51dca73cc077d6d971c5b739&base_oid=32ee8ff5f1ecb016a404cc3589d05910cabc1b9b&head_oid=146978f28a1c4ac8f4b5db1a39335540be1a38ef  app.options('*', (_req, res) => {
    res.sendStatus(204);
  });

  app.use(express.json({ limit: '2mb' }));
  app.use(requestContextMiddleware);

  app.use(`${config.apiPrefix}/crises`, crisisRoutes);
  app.use(`${config.apiPrefix}/personnel`, personnelRoutes);
  app.use(`${config.apiPrefix}/demo`, demoRoutes);
  app.use(`${config.apiPrefix}/venues/:venueId/devices`, deviceRoutes);
  app.use(`${config.apiPrefix}/venues/:venueId/telemetry`, telemetryRoutes);
  app.use(`${config.apiPrefix}/internal/edge`, edgeRoutes);
  app.use(`${config.apiPrefix}/health`, healthRoutes);
  app.use(`${config.apiPrefix}/sim`, simRoutes);

  app.use('/sim', express.static(path.join(__dirname, '..', '..', 'public', 'sim')));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
