import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server.js';

describe('User Integration Tests', () => {
  it('GET /api/v1/users/me should return 401 when not authenticated', async () => {
    const response = await request(app).get('/api/v1/users/me');
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  it('PUT /api/v1/users/me should return 401 when not authenticated', async () => {
    const response = await request(app).put('/api/v1/users/me').send({
      location: 'New Location'
    });
    expect(response.status).toBe(401);
  });
});
