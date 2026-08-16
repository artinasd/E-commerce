import { cookies } from 'next/headers';
import { findUserBySessionToken, revokeSession } from '../../server/db/repositories/auth.js';

export const SESSION_COOKIE_NAME = 'ecom_session';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

export async function setSessionCookie(token, expiresAt) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    ...COOKIE_OPTIONS,
    expires: expiresAt,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    expires: new Date(0),
    maxAge: 0,
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const sessionUser = await findUserBySessionToken(token);
  if (!sessionUser) return null;

  return {
    id: sessionUser.id,
    email: sessionUser.email,
    phone: sessionUser.phone,
    firstName: sessionUser.first_name,
    lastName: sessionUser.last_name,
    role: sessionUser.role,
    emailVerified: Boolean(sessionUser.email_verified_at),
    phoneVerified: Boolean(sessionUser.phone_verified_at),
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    const error = new Error('Authentication required.');
    error.code = 'UNAUTHENTICATED';
    throw error;
  }
  return user;
}

export async function requireRole(roles) {
  const user = await requireUser();
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!allowedRoles.includes(user.role)) {
    const error = new Error('You do not have permission to perform this action.');
    error.code = 'FORBIDDEN';
    throw error;
  }

  return user;
}

export async function logoutCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) await revokeSession(token);
  await clearSessionCookie();
}
