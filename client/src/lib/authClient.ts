import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Use the current origin so requests go through the Vite proxy in dev
  // and the real domain in production
  baseURL: typeof window !== "undefined" ? window.location.origin : "http://localhost:5173",
});
