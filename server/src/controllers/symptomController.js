import { pool } from "../config/db.js";

/**
 * Log a new symptom
 * POST /api/v1/symptoms
 */
export const logSymptom = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, severity, notes } = req.body;

    if (!type || !severity) {
      return res.status(400).json({ success: false, error: "Type and severity are required" });
    }

    const result = await pool.query(
      `INSERT INTO symptoms (user_id, type, severity, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, type, severity, notes]
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
 * Get symptom history
 * GET /api/v1/symptoms
 */
export const getSymptoms = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM symptoms 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
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
 * Delete a symptom entry
 * DELETE /api/v1/symptoms/:id
 */
export const deleteSymptom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `DELETE FROM symptoms WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Symptom not found or unauthorized" });
    }

    res.json({
      success: true,
      message: "Symptom entry deleted",
    });
  } catch (err) {
    next(err);
  }
};
