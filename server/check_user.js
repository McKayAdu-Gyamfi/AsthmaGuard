import { pool } from './src/config/db.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkUser() {
  try {
    const res = await pool.query('SELECT id, email, name FROM "user" WHERE email = $1', ['smarcoeam2310@gmail.com']);
    console.log('User found:', res.rows);
  } catch (err) {
    console.error('DB Error:', err);
  } finally {
    await pool.end();
  }
}
checkUser();
