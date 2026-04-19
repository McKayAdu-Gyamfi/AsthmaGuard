import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server.js';

describe('Emergency Integration Tests', () => {
  it('POST /api/v1/emergency/trigger should return 401 when not authenticated', async () => {
    const response = await request(app)
      .post('/api/v1/emergency/trigger')
      .send({ location: 'Accra' });
    
    expect(response.status).toBe(401);
  });

  it('PATCH /api/v1/emergency/:id/resolve should return 401 when not authenticated', async () => {
    const response = await request(app)
      .patch('/api/v1/emergency/uuid-placeholder/resolve');
    
    expect(response.status).toBe(401);
  });
});
