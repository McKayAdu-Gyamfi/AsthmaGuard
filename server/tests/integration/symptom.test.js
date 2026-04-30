import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server.js';

describe('Symptom Integration Tests', () => {

  describe('Log Symptom', () => {
    it('POST /api/v1/symptoms should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/v1/symptoms')
        .send({ type: 'Wheezing', severity: 3 });
      expect(response.status).toBe(401);
    });

    it('POST /api/v1/symptoms should return 401 with missing fields', async () => {
      const response = await request(app)
        .post('/api/v1/symptoms')
        .send({});
      expect(response.status).toBe(401);
    });

    it('POST /api/v1/symptoms should return 401 with invalid severity', async () => {
      const response = await request(app)
        .post('/api/v1/symptoms')
        .send({ type: 'Wheezing', severity: 99 });
      expect(response.status).toBe(401);
    });
  });

  describe('Get Symptoms', () => {
    it('GET /api/v1/symptoms should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/symptoms');
      expect(response.status).toBe(401);
    });
  });

  describe('Delete Symptom', () => {
    it('DELETE /api/v1/symptoms/:id should return 401 when not authenticated', async () => {
      const response = await request(app)
        .delete('/api/v1/symptoms/test-id-123');
      expect(response.status).toBe(401);
    });

    it('DELETE /api/v1/symptoms/:id should return 401 with invalid id', async () => {
      const response = await request(app)
        .delete('/api/v1/symptoms/nonexistent-id');
      expect(response.status).toBe(401);
    });
  });

});
