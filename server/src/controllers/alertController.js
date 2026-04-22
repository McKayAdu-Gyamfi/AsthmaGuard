import { pool } from "../config/db.js";

/**
 * Get all alerts for the authenticated user
 * GET /api/v1/alerts
 */
export const getAlerts = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM alerts 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
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
 * Create a new alert manually
 * POST /api/v1/alerts
 */
export const createAlert = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { location, risk_level, aqi, message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: "Alert message is required" });
    }

    const result = await pool.query(
      `INSERT INTO alerts (user_id, location, risk_level, aqi, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, location, risk_level, aqi, message]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete (dismiss) an alert
 * DELETE /api/v1/alerts/:id
 */
export const deleteAlert = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `DELETE FROM alerts WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Alert not found or unauthorized" });
    }
    
    res.json({
      success: true,
      message: "Alert dismissed",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Mark an alert as read
 * PUT /api/v1/alerts/:id/read
 */
export const markAlertRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE alerts SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Alert not found or unauthorized" });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};
