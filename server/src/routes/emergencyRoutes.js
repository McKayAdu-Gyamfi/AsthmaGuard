import express from "express";
import { triggerEmergency, resolveEmergency, getEmergencyGuide, notifyContacts } from "../controllers/emergencyController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.get("/guide", getEmergencyGuide);

router.use(requireAuth);

router.post("/trigger", triggerEmergency);
router.patch("/:id/resolve", resolveEmergency);
router.post("/notify-contacts", notifyContacts);

export default router;
