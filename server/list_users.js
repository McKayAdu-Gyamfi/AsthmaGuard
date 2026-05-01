import { pool } from './src/config/db.js';
import dotenv from 'dotenv';
dotenv.config();

async function listUsers() {
  try {
    const res = await pool.query('SELECT id, email, name FROM "user" LIMIT 10');
    console.log('Users in DB:', res.rows);
  } catch (err) {
    console.error('DB Error:', err);
  } finally {
    await pool.end();
  }
}
listUsers();
