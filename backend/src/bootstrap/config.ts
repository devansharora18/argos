export interface AppConfig {
  serviceName: string;
  apiPrefix: string;
  gcpRegion: string;
  idempotencyTtlHours: number;
  edgeReplayMaxBatchSize: number;
  edgeReplayDedupWindowSeconds: number;
  telemetrySummaryMaxLimit: number;
  pubsubDisabled: boolean;
  authDisabled: boolean;
  port: number;
  geminiApiKey: string;
  gcpProjectId: string;
  fcmEnabled: boolean;
  demoApiKey: string;
}

function readNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readBoolean(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  return raw.toLowerCase() === 'true';
}

export const config: AppConfig = {
  serviceName: process.env.SERVICE_NAME ?? 'haven-backend',
  apiPrefix: '/api/v1',
  gcpRegion: process.env.GCP_REGION ?? 'us-central1',
  idempotencyTtlHours: readNumber('IDEMPOTENCY_TTL_HOURS', 24),
  edgeReplayMaxBatchSize: readNumber('EDGE_REPLAY_MAX_BATCH_SIZE', 500),
  edgeReplayDedupWindowSeconds: readNumber('EDGE_REPLAY_DEDUP_WINDOW_SECONDS', 5),
  telemetrySummaryMaxLimit: readNumber('TELEMETRY_SUMMARY_MAX_LIMIT', 200),
  pubsubDisabled: readBoolean('PUBSUB_DISABLED', false),
  authDisabled: readBoolean('AUTH_DISABLED', false),
  port: readNumber('PORT', 8080),
  geminiApiKey: process.env.GEMINI_API_KEY ?? '',
  gcpProjectId: process.env.GCP_PROJECT_ID ?? '',
  fcmEnabled: readBoolean('FCM_ENABLED', false),
  demoApiKey: process.env.DEMO_API_KEY ?? 'haven-demo-2024',
};
