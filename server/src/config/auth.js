import { betterAuth } from "better-auth";
import { pool } from "./db.js";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
  trustedOrigins: ["http://localhost:5173", "http://localhost:4000", "http://localhost:3000"],
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});
