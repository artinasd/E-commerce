import { getCurrentUser, requireRole, requireUser } from '../../lib/auth/session.js';
import { ApiError } from './errors.js';

export async function authenticatedUser() {
  try {
    return await requireUser();
  } catch (error) {
    if (error?.code === 'UNAUTHENTICATED') throw ApiError.unauthorized();
    throw error;
  }
}

export async function authorizedRoles(roles) {
  try {
    return await requireRole(roles);
  } catch (error) {
    if (error?.code === 'UNAUTHENTICATED') throw ApiError.unauthorized();
    if (error?.code === 'FORBIDDEN') throw ApiError.forbidden();
    throw error;
  }
}

export async function optionalUser() {
  return getCurrentUser();
}
