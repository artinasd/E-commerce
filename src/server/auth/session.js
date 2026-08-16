import { randomBytes } from 'node:crypto';
import { withTransaction } from '../db/connection.js';
import { AuthError, AuthorizationError } from './errors.js';

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export function createSessionToken() {
  return randomBytes(32).toString('base64url');
}

export async function createSession(connection, userId, token) {
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);
  await connection.execute(
    `INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)`,
    [token, userId, expiresAt],
  );
  return { token, expiresAt };
}

export async function authenticateSession(token) {
  if (!token) throw new AuthError('Authentication required.');

  const [rows] = await withTransaction(async (connection) => connection.execute(
    `SELECT s.id AS session_id, s.user_id, s.expires_at,
            u.email, u.phone, u.first_name, u.last_name, u.role
       FROM sessions s
       INNER JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
        AND s.expires_at > CURRENT_TIMESTAMP
        AND u.is_active = TRUE
        AND u.deleted_at IS NULL
      LIMIT 1`,
    [token],
  ));

  const session = rows[0];
  if (!session) throw new AuthError('Authentication required.');

  return {
    id: Number(session.user_id),
    email: session.email,
    phone: session.phone,
    firstName: session.first_name,
    lastName: session.last_name,
    role: session.role,
    sessionId: session.session_id,
    expiresAt: session.expires_at,
  };
}

export async function revokeSession(token) {
  if (!token) return;
  await withTransaction(async (connection) => {
    await connection.execute('DELETE FROM sessions WHERE id = ?', [token]);
  });
}

export function requireRole(user, allowedRoles) {
  if (!user || !allowedRoles.includes(user.role)) throw new AuthorizationError();
  return user;
}

export function sessionCookieOptions(expiresAt) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  };
}
