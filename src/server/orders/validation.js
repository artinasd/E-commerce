const MAX_LIMIT = 50;

function requiredString(value, field, maxLength = 255) {
  if (typeof value !== 'string' || value.trim().length === 0 || value.trim().length > maxLength) {
    const error = new Error(`${field} is required and must be no longer than ${maxLength} characters.`);
    error.code = 'VALIDATION_ERROR';
    throw error;
  }
  return value.trim();
}

export function validateShippingAddress(input = {}) {
  return {
    recipientName: requiredString(input.recipientName, 'recipientName', 120),
    recipientPhone: requiredString(input.recipientPhone, 'recipientPhone', 30),
    province: requiredString(input.province, 'province', 100),
    city: requiredString(input.city, 'city', 100),
    addressLine: requiredString(input.addressLine, 'addressLine', 500),
    postalCode: requiredString(input.postalCode, 'postalCode', 20),
  };
}

export function validateOrderId(value) {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) {
    const error = new Error('Invalid order id.');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }
  return id;
}

export function parseOrderQuery(searchParams) {
  const requestedPage = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const requestedLimit = Number.parseInt(searchParams.get('limit') ?? '20', 10);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, MAX_LIMIT)
    : 20;

  return { page, limit, offset: (page - 1) * limit };
}
