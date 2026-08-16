import { hashPassword, verifyPassword } from '../../lib/auth/password.js';
import { clearSessionCookie, setSessionCookie } from '../../lib/auth/session.js';
import { findUserByEmail, findUserByPhone } from '../db/repositories/users.js';
import {
  createUserWithSession,
  revokeAllUserSessions,
  updateUserPassword,
} from '../db/repositories/auth.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[1-9]\d{9,14}$/;

function normalizeEmail(email) {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  return EMAIL_PATTERN.test(normalized) ? normalized : null;
}

function normalizePhone(phone) {
  if (!phone) return null;
  const normalized = phone.replace(/[\s()-]/g, '');
  return PHONE_PATTERN.test(normalized) ? normalized : null;
}

function validateIdentity({ email, phone }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedEmail && !normalizedPhone) {
    throw new Error('A valid email address or phone number is required.');
  }

  return { email: normalizedEmail, phone: normalizedPhone };
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
  };
}

export async function register({ email, phone, password, firstName, lastName }) {
  const identity = validateIdentity({ email, phone });

  if (typeof password !== 'string' || password.length < 8) {
    throw new Error('Password must contain at least 8 characters.');
  }

  if (identity.email && await findUserByEmail(identity.email)) {
    const error = new Error('An account already exists with this email address.');
    error.code = 'IDENTITY_EXISTS';
    throw error;
  }

  if (identity.phone && await findUserByPhone(identity.phone)) {
    const error = new Error('An account already exists with this phone number.');
    error.code = 'IDENTITY_EXISTS';
    throw error;
  }

  const passwordHash = await hashPassword(password);
  const result = await createUserWithSession({
    ...identity,
    firstName: firstName?.trim() || null,
    lastName: lastName?.trim() || null,
  }, passwordHash);

  await setSessionCookie(result.token, result.expiresAt);

  return {
    user: {
      id: result.userId,
      email: identity.email,
      phone: identity.phone,
      firstName: firstName?.trim() || null,
      lastName: lastName?.trim() || null,
      role: 'CUSTOMER',
    },
  };
}

export async function login({ email, phone, password }) {
  const identity = validateIdentity({ email, phone });
  const user = identity.email
    ? await findUserByEmail(identity.email)
    : await findUserByPhone(identity.phone);

  if (!user || !user.is_active || !(await verifyPassword(password, user.password_hash))) {
    const error = new Error('Invalid credentials.');
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const { createSession } = await import('../db/repositories/auth.js');
  const session = await createSession(user.id);
  await setSessionCookie(session.token, session.expiresAt);

  return { user: publicUser(user) };
}

export async function logout() {
  await clearSessionCookie();
}

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await (await import('../db/repositories/users.js')).findUserById(userId);
  if (!user || !user.password_hash) throw new Error('User account could not be found.');

  if (!(await verifyPassword(currentPassword, user.password_hash))) {
    const error = new Error('Current password is incorrect.');
    error.code = 'INVALID_CURRENT_PASSWORD';
    throw error;
  }

  const passwordHash = await hashPassword(newPassword);
  await updateUserPassword(userId, passwordHash);
  await revokeAllUserSessions(userId);
};
