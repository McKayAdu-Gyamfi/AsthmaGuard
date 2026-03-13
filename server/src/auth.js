import { auth } from "better-auth";
import { betterAuthExpress } from "better-auth/express";
import { db } from "./config/db.js";

export const auth = auth({
    database: db,
    emailAndPassword: {
        enabled: true,
    },
    // plugins: {


    // }
});

export const authMiddleware = betterAuthExpress(auth);