import express from "express";
import { addMedication, getMedications, logMedicationUse, deleteMedication } from "../controllers/medicationController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", addMedication);
router.get("/", getMedications);
router.post("/:id/log", logMedicationUse);
router.delete("/:id", deleteMedication);

export default router;
