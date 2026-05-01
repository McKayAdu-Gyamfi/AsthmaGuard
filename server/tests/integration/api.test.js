import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../../server.js';

describe('API Integration Tests', () => {
  it('GET /api/risk should return 200 and risk data', async () => {
    const response = await request(app).get('/api/v1/risk');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  });

  it('GET /api/v1/environment/current should return 401 without auth', async () => {
    const response = await request(app).get('/api/v1/environment/current');
    expect(response.status).toBe(401);
  });
});
