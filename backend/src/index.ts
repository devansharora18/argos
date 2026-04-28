import { onRequest } from 'firebase-functions/v2/https';
import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { createApp } from './bootstrap/app';
import { config } from './bootstrap/config';
import { classifyCrisisWorker } from './workers/classifyCrisis';
import { dispatchToStaffWorker } from './workers/dispatchToStaff';
import { ingestEdgeDetectionWorker } from './workers/ingestEdgeDetection';
import { monitorEscalationWorker } from './workers/monitorEscalation';
import { notifyGuestsWorker } from './workers/notifyGuests';
import { orchestrateResponseWorker } from './workers/orchestrateResponse';
import { replayEdgeBatchWorker } from './workers/replayEdgeBatch';

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

export const notifyGuests = onMessagePublished(
  { topic: 'guest.notification.requested', region: config.gcpRegion },
  notifyGuestsWorker
export const ingestEdgeDetection = onMessagePublished(
  { topic: 'edge.detected', region: config.gcpRegion },
  ingestEdgeDetectionWorker
);

export const replayEdgeBatch = onMessagePublished(
  { topic: 'edge.replay.requested', region: config.gcpRegion },
  replayEdgeBatchWorker
);

export const monitorEscalation = onSchedule(
  { schedule: 'every 1 minutes', region: config.gcpRegion },
  monitorEscalationWorker
);
