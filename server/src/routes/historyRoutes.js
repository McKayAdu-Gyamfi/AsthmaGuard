import express from "express";
import { getHistory, getWeeklyHistory } from "../controllers/historyController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getHistory);
router.get("/weekly", getWeeklyHistory);

export default router;
