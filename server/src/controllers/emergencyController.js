import { pool } from "../config/db.js";
import { sendEmergencyAlert } from "../services/notificationService.js";
import nodemailer from "nodemailer";

/**
 * Trigger an Emergency
 * POST /api/v1/emergency/trigger
 */
export const triggerEmergency = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userName = req.user.name;
    const { location } = req.body;

    if (!location) {
      return res.status(400).json({ success: false, error: "Location is required" });
    }

    // 1. Record the emergency in the database
    const emergencyResult = await pool.query(
      `INSERT INTO emergencies (user_id, location, status)
       VALUES ($1, $2, 'active')
       RETURNING *`,
      [userId, location]
    );

    const emergency = emergencyResult.rows[0];

    // 2. Fetch user's emergency contacts
    const profileResult = await pool.query(
      `SELECT emergency_contacts FROM user_profiles WHERE id = $1`,
      [userId]
    );

    const contacts = profileResult.rows.length > 0 ? profileResult.rows[0].emergency_contacts : [];

    // 3. Dispatch notifications (async but we wait for it to confirm dispatch)
    await sendEmergencyAlert({ name: userName }, contacts, location);

    res.status(201).json({
      success: true,
      data: emergency,
      notified: contacts.length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Resolve an Emergency
 * PATCH /api/v1/emergency/:id/resolve
 */
export const resolveEmergency = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `UPDATE emergencies 
       SET status = 'resolved' 
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Emergency not found or unauthorized" });
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
 * Get Emergency Guide
 * GET /api/v1/emergency/guide
 */
export const getEmergencyGuide = async (req, res, next) => {
  try {
    const guide = [
      { step: 1, text: "Stay calm and sit upright." },
      { step: 2, text: "Take 1 puff of your reliever inhaler." },
      { step: 3, text: "Wait 1 minute, then take another puff if needed." },
      { step: 4, text: "If symptoms do not improve after 10 puffs, call emergency services." }
    ];
    res.json({ success: true, data: guide });
  } catch (err) {
    next(err);
  }
};

/**
 * Notify Emergency Contacts via Nodemailer
 * POST /api/v1/emergency/notify-contacts
 */
export const notifyContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userName = req.user.name;
    const { location } = req.body;

    const profileResult = await pool.query(
      `SELECT emergency_contacts FROM user_profiles WHERE id = $1`,
      [userId]
    );

    const contacts = profileResult.rows.length > 0 ? profileResult.rows[0].emergency_contacts : [];
    const emails = Array.isArray(contacts) ? contacts.map(c => c.email).filter(Boolean) : [];

    if (emails.length === 0) {
      return res.status(404).json({ success: false, error: "No contact emails found" });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'no-reply@example.com',
        pass: process.env.EMAIL_PASS || 'password'
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'no-reply@example.com',
      to: emails.join(','),
      subject: `EMERGENCY ALERT from ${userName}`,
      text: `EMERGENCY ALERT: ${userName} is experiencing an asthma emergency at ${location || 'an unknown location'}. Please check on them immediately.`
    });

    res.status(200).json({ success: true, message: "Contacts notified successfully via email.", notified: emails.length });
  } catch (err) {
    next(err);
  }
};
