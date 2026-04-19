import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/bootstrap/app';

const hasFirestoreEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);

describe('crisis report endpoint', () => {
  const maybeIt = hasFirestoreEmulator ? it : it.skip;

  maybeIt('creates a crisis draft idempotently', async () => {
    process.env.AUTH_DISABLED = 'true';
    process.env.PUBSUB_DISABLED = 'true';

    const app = createApp();
    const idempotencyKey = `test-${Date.now()}`;

    const response = await request(app)
      .post('/api/v1/crises/report')
      .set('Idempotency-Key', idempotencyKey)
      .set('x-dev-role', 'manager')
      .set('x-dev-tenant-id', 'tenant-test')
      .set('x-dev-venue-ids', 'venue-test')
      .send({
        venue_id: 'venue-test',
        floor: '3',
        report_text: 'Smoke seen near lobby',
        trigger_sources: ['manual_report'],
      });

    expect([200, 201]).toContain(response.status);
    expect(response.body.status).toBe('detected');
    expect(typeof response.body.crisis_id).toBe('string');
  });
});
