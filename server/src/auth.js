import { betterAuth } from "better-auth";
import { betterAuthExpress } from "better-auth/express";
import { db } from "./config/db.js";

export const auth = betterAuth({
    database: db,
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }
    }
});

export const authMiddleware = betterAuthExpress(auth);