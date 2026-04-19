/**
 * server.js
 * Entry point for Smart Asthma Risk API
 */

import express from "express";
import cors from "cors";

// Routes
import riskRoutes from "./routes/risk.js";

const app = express();

// ─── MIDDLEWARE ─────────────────────────────
app.use(cors());
app.use(express.json());

// ─── ROUTES ────────────────────────────────
app.use("/api/risk", riskRoutes);

// ─── HEALTH CHECK  ──────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Asthma Risk API is running 🚀"
  });
});

// ─── START SERVER ───────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});