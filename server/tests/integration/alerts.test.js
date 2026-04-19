import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server.js';

describe('Alerts Integration Tests', () => {
  it('GET /api/v1/alerts should return 401 when not authenticated', async () => {
    const response = await request(app).get('/api/v1/alerts');
    expect(response.status).toBe(401);
  });

  it('POST /api/v1/alerts should return 401 when not authenticated', async () => {
    const response = await request(app)
      .post('/api/v1/alerts')
      .send({ message: 'Hazardous Air Quality' });
    expect(response.status).toBe(401);
  });

  it('DELETE /api/v1/alerts/:id should return 401 when not authenticated', async () => {
    const response = await request(app).delete('/api/v1/alerts/uuid-placeholder');
    expect(response.status).toBe(401);
  });
});
