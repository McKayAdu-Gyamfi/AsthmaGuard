import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server.js';

describe('Health Tracking Integration Tests', () => {
  describe('Symptom Tracking', () => {
    it('POST /api/v1/symptoms should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/v1/symptoms')
        .send({ type: 'Wheezing', severity: 3 });
      expect(response.status).toBe(401);
    });

    it('GET /api/v1/symptoms should return 401 when not authenticated', async () => {
      const response = await request(app).get('/api/v1/symptoms');
      expect(response.status).toBe(401);
    });
  });

  describe('Medication Tracking', () => {
    it('POST /api/v1/medications should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/v1/medications')
        .send({ name: 'Albuterol', type: 'Rescue' });
      expect(response.status).toBe(401);
    });

    it('GET /api/v1/medications should return 401 when not authenticated', async () => {
      const response = await request(app).get('/api/v1/medications');
      expect(response.status).toBe(401);
    });
  });
});
