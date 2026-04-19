export interface AppConfig {
  serviceName: string;
  apiPrefix: string;
  gcpRegion: string;
  idempotencyTtlHours: number;
  pubsubDisabled: boolean;
  authDisabled: boolean;
  port: number;
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
  pubsubDisabled: readBoolean('PUBSUB_DISABLED', false),
  authDisabled: readBoolean('AUTH_DISABLED', false),
  port: readNumber('PORT', 8080),
};
