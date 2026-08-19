const PHONE_PATTERN = /^(?:\+?[1-9]\d{9,14}|09\d{9})$/;

function text(value, field, maxLength) {
  if (typeof value !== 'string' || value.trim().length === 0 || value.trim().length > maxLength) {
    const error = new Error(`${field} is required and must be no longer than ${maxLength} characters.`);
    error.code = 'VALIDATION_ERROR';
    throw error;
  }
  return value.trim();
}

function optionalText(value, field, maxLength) {
  if (value == null || value === '') return null;
  return text(value, field, maxLength);
}

export function validateProfileInput(input = {}) {
  const firstName = text(input.firstName, 'firstName', 100);
  const lastName = text(input.lastName, 'lastName', 100);
  const phone = optionalText(input.phone, 'phone', 32);

  if (phone && !PHONE_PATTERN.test(phone.replace(/[\s()-]/g, ''))) {
    const error = new Error('phone is invalid.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  return { firstName, lastName, phone: phone?.replace(/[\s()-]/g, '') ?? null };
}

export function validateAddressInput(input = {}) {
  return {
    recipientName: text(input.recipientName, 'recipientName', 200),
    recipientPhone: text(input.recipientPhone, 'recipientPhone', 32),
    province: text(input.province, 'province', 100),
    city: text(input.city, 'city', 100),
    addressLine: text(input.addressLine, 'addressLine', 1000),
    postalCode: text(input.postalCode, 'postalCode', 20),
    plaque: optionalText(input.plaque, 'plaque', 50),
    unit: optionalText(input.unit, 'unit', 50),
    isDefault: Boolean(input.isDefault),
  };
}

export function validateAddressId(value) {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) {
    const error = new Error('Invalid address id.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }
  return id;
}
