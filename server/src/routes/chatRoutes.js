import express from "express";
import { getChatResponse } from "../services/chatService.js";

const router = express.Router();

// POST /v1/chat - Send a message to the AI Asthma doctor
router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Invalid request. Please provide an array of messages with at least one message."
      });
    }

    // Validate message format
    const validMessages = messages.every(msg => 
      msg.sender && msg.text && typeof msg.text === 'string'
    );

    if (!validMessages) {
      return res.status(400).json({
        error: "Each message must have 'sender' (user/ai) and 'text' (string) fields."
      });
    }

    // Get AI response
    const aiResponse = await getChatResponse(messages);

    res.json({
      success: true,
      response: aiResponse
    });
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({
      error: "Failed to get AI response",
      message: error.message
    });
  }
});

export default router;
