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

const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:4000"],
  credentials: true,
}));

// Better Auth integration - Using a custom middleware to ensure raw stream access
// and avoid Express path-stripping issues.
app.use((req, res, next) => {
  if (req.path.startsWith("/api/auth")) {
    return toNodeHandler(auth)(req, res);
  }
  next();
});

// JSON parser for all other routes
app.use(express.json());

// Root Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Asthma Risk API is running 🚀",
  });
});

// Centralized API Routes
app.use("/api", apiRoutes);

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔑 Auth baseURL: ${process.env.BETTER_AUTH_URL}`);

    // Verify database connection
    try {
      const client = await pool.connect();
      const dbResult = await client.query("SELECT NOW() AS time");
      client.release();
      console.log(`✅ Database connected successfully — server time: ${dbResult.rows[0].time}`);
    } catch (err) {
      console.error("❌ Database connection FAILED:", err.message);
    }
  });
}

export default app;