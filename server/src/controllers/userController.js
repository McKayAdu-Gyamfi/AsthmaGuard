import { pool } from "../config/db.js";

/**
 * Get current user profile
 * GET /api/v1/users/me
 */
export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user and profile in a join
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.image, 
              p.location, p.latitude, p.longitude, p.notify_on_high, p.notify_on_medium, p.emergency_contacts
       FROM "user" u
       LEFT JOIN user_profiles p ON u.id = p.id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update current user profile
 * PUT /api/v1/users/me
 */
export const updateMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { location, latitude, longitude, notify_on_high, notify_on_medium, emergency_contacts } = req.body;

    // Upsert profile
    const result = await pool.query(
      `INSERT INTO user_profiles (id, location, latitude, longitude, notify_on_high, notify_on_medium, emergency_contacts)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE 
       SET location = EXCLUDED.location,
           latitude = EXCLUDED.latitude,
           longitude = EXCLUDED.longitude,
           notify_on_high = EXCLUDED.notify_on_high,
           notify_on_medium = EXCLUDED.notify_on_medium,
           emergency_contacts = EXCLUDED.emergency_contacts,
           updated_at = NOW()
       RETURNING *`,
      [
        userId,
        location || 'Accra, Ghana',
        latitude || 5.6037,
        longitude || -0.1870,
        notify_on_high !== undefined ? notify_on_high : true,
        notify_on_medium !== undefined ? notify_on_medium : false,
        emergency_contacts ? JSON.stringify(emergency_contacts) : '[]'
      ]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};
