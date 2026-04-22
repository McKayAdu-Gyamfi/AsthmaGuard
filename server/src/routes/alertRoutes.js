import express from "express";
import { getAlerts, createAlert, deleteAlert, markAlertRead } from "../controllers/alertController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getAlerts);
router.post("/", createAlert);
router.put("/:id/read", markAlertRead);
router.delete("/:id", deleteAlert);

export default router;
