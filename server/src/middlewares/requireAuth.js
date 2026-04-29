import { auth } from "../config/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { pool } from "../config/db.js";

const DEMO_USER_ID = "11111111-1111-1111-1111-111111111111";

export const requireAuth = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });

    if (!session) {
      // Ensure demo user exists to prevent foreign key errors
      await pool.query(`
        INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
        VALUES ($1, 'Demo User', 'demo@example.com', true, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `, [DEMO_USER_ID]).catch(err => console.error("Mock user insert error:", err));

      req.user = { id: DEMO_USER_ID, name: 'Demo User', email: 'demo@example.com' };
      return next();
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
