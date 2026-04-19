import { onRequest } from 'firebase-functions/v2/https';
import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { createApp } from './bootstrap/app';
import { config } from './bootstrap/config';
import { classifyCrisisWorker } from './workers/classifyCrisis';
import { dispatchToStaffWorker } from './workers/dispatchToStaff';
import { monitorEscalationWorker } from './workers/monitorEscalation';
import { orchestrateResponseWorker } from './workers/orchestrateResponse';

const app = createApp();

export const api = onRequest({ region: config.gcpRegion }, app);

export const classifyCrisis = onMessagePublished(
  { topic: 'crisis.created', region: config.gcpRegion },
  classifyCrisisWorker
);

export const orchestrateResponse = onMessagePublished(
  { topic: 'orchestration.requested', region: config.gcpRegion },
  orchestrateResponseWorker
);

export const dispatchToStaff = onMessagePublished(
  { topic: 'dispatch.requested', region: config.gcpRegion },
  dispatchToStaffWorker
);

export const monitorEscalation = onSchedule(
  { schedule: 'every 1 minutes', region: config.gcpRegion },
  monitorEscalationWorker
);
