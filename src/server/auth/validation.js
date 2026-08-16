const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[1-9]\d{9,14}$/;

export function normalizeEmail(email) {
  if (typeof email !== 'string' || !email.trim()) return null;
  const value = email.trim().toLowerCase();
  return EMAIL_PATTERN.test(value) ? value : null;
}

export function normalizePhone(phone) {
  if (typeof phone !== 'string' || !phone.trim()) return null;
  const value = phone.replace(/[\s()-]/g, '');
  return PHONE_PATTERN.test(value) ? value : null;
}

export function validateRegistrationInput(input = {}) {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const password = input.password;
  const errors = {};

  if (!email && !phone) errors.identity = 'A valid email address or phone number is required.';
  if (typeof password !== 'string' || password.length < 8) {
    errors.password = 'Password must contain at least 8 characters.';
  }
  if (typeof input.firstName === 'string' && input.firstName.trim().length > 100) {
    errors.firstName = 'First name is too long.';
  }
  if (typeof input.lastName === 'string' && input.lastName.trim().length > 100) {
    errors.lastName = 'Last name is too long.';
  }

  return { valid: Object.keys(errors).length === 0, errors, data: { email, phone, password } };
}

export function validateLoginInput(input = {}) {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const errors = {};

  if (!email && !phone) errors.identity = 'A valid email address or phone number is required.';
  if (typeof input.password !== 'string' || input.password.length === 0) {
    errors.password = 'Password is required.';
  }

  return { valid: Object.keys(errors).length === 0, errors, data: { email, phone, password: input.password } };
}

export function validatePasswordChangeInput(input = {}) {
  const errors = {};

  if (typeof input.currentPassword !== 'string' || input.currentPassword.length === 0) {
    errors.currentPassword = 'Current password is required.';
  }
  if (typeof input.newPassword !== 'string' || input.newPassword.length < 8) {
    errors.newPassword = 'New password must contain at least 8 characters.';
  }
  if (input.newPassword !== input.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    data: { currentPassword: input.currentPassword, newPassword: input.newPassword },
  };
}
