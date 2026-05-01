import { betterAuth } from "better-auth";
import { pool } from "./db.js";
import nodemailer from "nodemailer";

// Helper to send emails
const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"AsthmaGuard" <noreply@asthmaguard.com>',
    to,
    subject,
    text,
    html,
  });
};

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000/api/auth",
  trustedOrigins: [
    // "http://localhost:5173", 
    // "http://localhost:5174", 
    // "http://localhost:4000", 
    // "http://localhost:3000",
    "https://asthma-guard.vercel.app",
    "https://asthmaguard.onrender.com"
  ],
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  email: {
    from: process.env.EMAIL_FROM || "noreply@asthmaguard.com",
    onSend: async ({ to, subject, text, html }) => {
      try {
        await sendEmail({ to, subject, text, html });
        console.log(`📧 Email sent to ${to}: ${subject}`);
      } catch (error) {
        console.error(`❌ Failed to send email to ${to}:`, error.message);
        throw error; // Rethrow so Better Auth knows it failed
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  // Map internal fields to match the snake_case DB columns
  user: {
    fields: {
      emailVerified: "email_verified",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  session: {
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  account: {
    fields: {
      accountId: "account_id",
      providerId: "provider_id",
      userId: "user_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      idToken: "id_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  verification: {
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
});
