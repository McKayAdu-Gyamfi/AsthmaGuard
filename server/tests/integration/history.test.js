import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server.js';

describe('History Integration Tests', () => {
  it('GET /api/v1/history should return 401 when not authenticated', async () => {
    const response = await request(app).get('/api/v1/history');
    expect(response.status).toBe(401);
  });
});
