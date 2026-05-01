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

/**
 * Get aggregated risk history for the last 7 days
 * GET /api/v1/history/weekly
 */
export const getWeeklyHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch daily average risk score for the last 7 days
    const result = await pool.query(
      `WITH last_7_days AS (
         SELECT 
           generate_series(
             CURRENT_DATE - INTERVAL '6 days', 
             CURRENT_DATE, 
             '1 day'::interval
           )::date AS day_date
       )
       SELECT 
         to_char(l7.day_date, 'Dy') as day,
         COALESCE(AVG(r.risk_score), 20) as risk_score,
         COALESCE(MAX(r.risk_level), 'LOW') as risk_level
       FROM last_7_days l7
       LEFT JOIN risk_readings r ON DATE(r.recorded_at) = l7.day_date AND r.user_id = $1
       GROUP BY l7.day_date
       ORDER BY l7.day_date ASC`,
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
