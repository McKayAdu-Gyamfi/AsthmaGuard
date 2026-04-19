import express from "express";
import { triggerEmergency, resolveEmergency } from "../controllers/emergencyController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.post("/trigger", triggerEmergency);
router.patch("/:id/resolve", resolveEmergency);

export default router;
