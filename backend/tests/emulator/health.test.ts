import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/bootstrap/app';

describe('health endpoint', () => {
  it('returns service health', async () => {
    const app = createApp();
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(typeof response.body.service).toBe('string');
    expect(typeof response.body.timestamp).toBe('string');
  });
});
