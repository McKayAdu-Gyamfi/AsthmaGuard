import { pool } from "../config/db.js";

/**
 * Add a new medication
 * POST /api/v1/medications
 */
export const addMedication = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, dosage, type, frequency } = req.body;

    if (!name || !type) {
      return res.status(400).json({ success: false, error: "Name and type are required" });
    }

    const result = await pool.query(
      `INSERT INTO medications (user_id, name, dosage, type, frequency)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, name, dosage, type, frequency]
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
 * Get all medications for user
 * GET /api/v1/medications
 */
export const getMedications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM medications WHERE user_id = $1 ORDER BY created_at DESC`,
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
 * Log medication usage
 * POST /api/v1/medications/:id/log
 */
export const logMedicationUse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify medication exists and belongs to user
    const medCheck = await pool.query(
      `SELECT id FROM medications WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (medCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Medication not found" });
    }

    const result = await pool.query(
      `INSERT INTO medication_logs (medication_id, user_id)
       VALUES ($1, $2)
       RETURNING *`,
      [id, userId]
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
 * Delete a medication
 * DELETE /api/v1/medications/:id
 */
export const deleteMedication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `DELETE FROM medications WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Medication not found or unauthorized" });
    }

    res.json({
      success: true,
      message: "Medication deleted",
    });
  } catch (err) {
    next(err);
  }
};
