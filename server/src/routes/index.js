import express from "express";
import environmentRoutes from "./environmentRoutes.js";
import riskRoutes from "./risk.js";
import userRoutes from "./userRoutes.js";
import emergencyRoutes from "./emergencyRoutes.js";
import symptomRoutes from "./symptomRoutes.js";
import medicationRoutes from "./medicationRoutes.js";
import historyRoutes from "./historyRoutes.js";
import alertRoutes from "./alertRoutes.js";
import { getChatResponse } from "../services/chatService.js";

const router = express.Router();

router.use("/v1/environment", environmentRoutes);
router.use("/v1/risk", riskRoutes);
router.use("/v1/users", userRoutes);
router.use("/v1/emergency", emergencyRoutes);
router.use("/v1/symptoms", symptomRoutes);
router.use("/v1/medications", medicationRoutes);
router.use("/v1/history", historyRoutes);
router.use("/v1/alerts", alertRoutes);

// AI Chat endpoint directly in index.js to avoid nested router issues
router.post("/v1/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Invalid request. Messages array required." });
    }
    const aiResponse = await getChatResponse(messages);
    res.json({ success: true, response: aiResponse });
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({ error: "Failed to get AI response", message: error.message });
  }
});



export default router;
