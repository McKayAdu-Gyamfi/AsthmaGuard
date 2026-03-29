import express from "express";
import dotenv from "dotenv";
import { auth } from "./src/config/auth.js";
import { toNodeHandler } from "better-auth/node";dotenv.config();

const app = express();

app.use(express.json());

// Mount Better Auth endpoints
app.use("/api/auth", (req, res, next) => {
  return toNodeHandler(auth)(req, res);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});