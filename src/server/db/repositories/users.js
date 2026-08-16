import { query } from '../connection.js';

export async function findUserById(id) {
  const rows = await query(
    `SELECT id, email, phone, password_hash, first_name, last_name, role,
            is_active, email_verified_at, phone_verified_at, created_at, updated_at
       FROM users
      WHERE id = ? AND deleted_at IS NULL
      LIMIT 1`,
    [id],
  );

  return rows[0] ?? null;
}

export async function findUserByEmail(email) {
  const rows = await query(
    `SELECT id, email, phone, password_hash, first_name, last_name, role,
            is_active, email_verified_at, phone_verified_at, created_at, updated_at
       FROM users
      WHERE email = ? AND deleted_at IS NULL
      LIMIT 1`,
    [email],
  );

  return rows[0] ?? null;
}

export async function findUserByPhone(phone) {
  const rows = await query(
    `SELECT id, email, phone, password_hash, first_name, last_name, role,
            is_active, email_verified_at, phone_verified_at, created_at, updated_at
       FROM users
      WHERE phone = ? AND deleted_at IS NULL
      LIMIT 1`,
    [phone],
  );

  return rows[0] ?? null;
}
