import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { auth } from "./src/config/auth.js";
import { toNodeHandler } from "better-auth/node";
import apiRoutes from "./src/routes/index.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { pool } from "./src/config/db.js";

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

// Better Auth endpoints
app.use("/api/auth", (req, res) => {
  return toNodeHandler(auth)(req, res);
});

// Centralized API Routes
app.use("/api", apiRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);

    // Verify database connection
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT NOW() AS time");
      client.release();
      console.log(`✅ Database connected successfully — server time: ${result.rows[0].time}`);
    } catch (err) {
      console.error("❌ Database connection FAILED:", err.message);
    }
  });
}

export default app;