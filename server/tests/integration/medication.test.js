import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server.js';

describe('Medication Integration Tests', () => {

  describe('Add Medication', () => {
    it('POST /api/v1/medications should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/v1/medications')
        .send({ name: 'Albuterol', type: 'Rescue' });
      expect(response.status).toBe(401);
    });

    it('POST /api/v1/medications should return 401 with missing fields', async () => {
      const response = await request(app)
        .post('/api/v1/medications')
        .send({});
      expect(response.status).toBe(401);
    });
  });

  describe('Get Medications', () => {
    it('GET /api/v1/medications should return 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/medications');
      expect(response.status).toBe(401);
    });
  });

  describe('Log Medication Use', () => {
    it('POST /api/v1/medications/:id/taken should return 401 when not authenticated', async () => {
      const response = await request(app)
        .post('/api/v1/medications/test-id-123/taken')
        .send({});
      expect(response.status).toBe(401);
    });

    it('POST /api/v1/medications/:id/taken should return 401 with invalid id', async () => {
      const response = await request(app)
        .post('/api/v1/medications/nonexistent-id/taken')
        .send({});
      expect(response.status).toBe(401);
    });
  });

  describe('Delete Medication', () => {
    it('DELETE /api/v1/medications/:id should return 401 when not authenticated', async () => {
      const response = await request(app)
        .delete('/api/v1/medications/test-id-123');
      expect(response.status).toBe(401);
    });
  });

});
