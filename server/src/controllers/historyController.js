import { pool } from "../config/db.js";

/**
 * Get past risk readings for the authenticated user
 * GET /api/v1/history
 */
export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch up to 50 most recent readings for the user
    const result = await pool.query(
      `SELECT * FROM risk_readings 
       WHERE user_id = $1 
       ORDER BY recorded_at DESC 
       LIMIT 50`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};
