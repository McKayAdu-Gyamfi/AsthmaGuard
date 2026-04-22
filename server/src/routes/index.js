import express from "express";
import environmentRoutes from "./environmentRoutes.js";
import riskRoutes from "./risk.js";
import userRoutes from "./userRoutes.js";
import emergencyRoutes from "./emergencyRoutes.js";
import symptomRoutes from "./symptomRoutes.js";
import medicationRoutes from "./medicationRoutes.js";
import historyRoutes from "./historyRoutes.js";
import alertRoutes from "./alertRoutes.js";

const router = express.Router();

router.use("/v1/environment", environmentRoutes);
router.use("/risk", riskRoutes);
router.use("/v1/users", userRoutes);
router.use("/v1/emergency", emergencyRoutes);
router.use("/v1/symptoms", symptomRoutes);
router.use("/v1/medications", medicationRoutes);
router.use("/v1/history", historyRoutes);
router.use("/v1/alerts", alertRoutes);



export default router;
