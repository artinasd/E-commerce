const ROLE_HIERARCHY = {
  CUSTOMER: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

export function hasRole(user, requiredRole) {
  if (!user || !requiredRole) return false;
  return (ROLE_HIERARCHY[user.role] ?? 0) >= (ROLE_HIERARCHY[requiredRole] ?? Number.MAX_SAFE_INTEGER);
}

export function hasAnyRole(user, roles) {
  if (!user || !Array.isArray(roles)) return false;
  return roles.includes(user.role);
}

export function assertRole(user, requiredRole) {
  if (!hasRole(user, requiredRole)) {
    const error = new Error('You do not have permission to perform this action.');
    error.code = 'FORBIDDEN';
    throw error;
  }
}

export const ROLES = Object.freeze({
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
});
