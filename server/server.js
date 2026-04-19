import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { auth } from "./src/config/auth.js";
import { toNodeHandler } from "better-auth/node";
import environmentRoutes from "./src/routes/environmentRoutes.js";
import riskRoutes from "./src/routes/risk.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Root Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Asthma Risk API is running 🚀",
  });
});

// Mount Better Auth endpoints
app.use("/api/auth", (req, res) => {
  return toNodeHandler(auth)(req, res);
});

// API Routes
app.use("/api/v1/environment", environmentRoutes);
app.use("/api/risk", riskRoutes);

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;