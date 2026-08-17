import crypto from 'node:crypto';
import { query, withTransaction } from '../connection.js';

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function generateSessionToken() {
  return crypto.randomBytes(32).toString('base64url');
}

function hashSessionToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function createUser({ email = null, phone = null, passwordHash, firstName = null, lastName = null }) {
  const result = await query(
    `INSERT INTO users (email, phone, password_hash, first_name, last_name, role, is_active)
     VALUES (?, ?, ?, ?, ?, 'CUSTOMER', TRUE)`,
    [email, phone, passwordHash, firstName, lastName],
  );

  return result.insertId;
}

export async function createSession(userId) {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  // The initial schema stores the session identifier in `sessions.id`.
  // Store the SHA-256 token hash there rather than requiring a schema change.
  await query(
    `INSERT INTO sessions (id, user_id, expires_at)
     VALUES (?, ?, ?)`,
    [tokenHash, userId, expiresAt],
  );

  return { token, expiresAt };
}

export async function findUserBySessionToken(token) {
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const rows = await query(
    `SELECT u.id, u.email, u.phone, u.first_name, u.last_name, u.role,
            u.is_active, u.email_verified_at, u.phone_verified_at,
            s.id AS session_id, s.expires_at
       FROM sessions s
       INNER JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
        AND s.expires_at > CURRENT_TIMESTAMP
        AND u.deleted_at IS NULL
        AND u.is_active = TRUE
      LIMIT 1`,
    [tokenHash],
  );

  return rows[0] ?? null;
}

export async function revokeSession(token) {
  if (!token) return false;

  const tokenHash = hashSessionToken(token);
  const result = await query(
    `DELETE FROM sessions
      WHERE id = ?`,
    [tokenHash],
  );

  return result.affectedRows > 0;
}

export async function revokeAllUserSessions(userId) {
  const result = await query(
    `DELETE FROM sessions
      WHERE user_id = ?`,
    [userId],
  );

  return result.affectedRows;
}

export async function updateUserPassword(userId, passwordHash) {
  return query(
    `UPDATE users
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND deleted_at IS NULL`,
    [passwordHash, userId],
  );
}

export async function createUserWithSession(user, passwordHash) {
  return withTransaction(async (connection) => {
    const [userResult] = await connection.execute(
      `INSERT INTO users (email, phone, password_hash, first_name, last_name, role, is_active)
       VALUES (?, ?, ?, ?, ?, 'CUSTOMER', TRUE)`,
      [user.email ?? null, user.phone ?? null, passwordHash, user.firstName ?? null, user.lastName ?? null],
    );

    const token = generateSessionToken();
    const tokenHash = hashSessionToken(token);
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await connection.execute(
      `INSERT INTO sessions (id, user_id, expires_at)
       VALUES (?, ?, ?)`,
      [tokenHash, userResult.insertId, expiresAt],
    );

    return { userId: Number(userResult.insertId), token, expiresAt };
  });
}
