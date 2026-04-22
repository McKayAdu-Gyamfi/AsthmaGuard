import { auth } from "../config/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const optionalAuth = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });

    if (session) {
      req.user = session.user;
      req.session = session.session;
    }
    
    next();
  } catch (err) {
    console.error("Optional Auth Middleware Error:", err);
    next();
  }
};
