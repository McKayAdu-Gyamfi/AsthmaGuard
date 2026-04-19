import express from "express";
import { getHistory } from "../controllers/historyController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getHistory);

export default router;
