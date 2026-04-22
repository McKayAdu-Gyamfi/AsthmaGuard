import express from "express";
import { logSymptom, getSymptoms, deleteSymptom } from "../controllers/symptomController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", logSymptom);
router.get("/", getSymptoms);
router.delete("/:id", deleteSymptom);

export default router;
