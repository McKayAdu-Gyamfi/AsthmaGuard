import express from 'express';
import { getCurrentConditions } from '../controllers/environmentController.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = express.Router();

// GET /api/v1/environment/current
router.get('/current', requireAuth, getCurrentConditions);

export default router;
