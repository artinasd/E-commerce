function positiveInt(value, field, max = 999) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1 || number > max) {
    const error = new Error(`${field} must be a positive integer no greater than ${max}.`);
    error.code = 'VALIDATION_ERROR';
    throw error;
  }
  return number;
}

export function validateVariantId(value) {
  return positiveInt(value, 'variantId', Number.MAX_SAFE_INTEGER);
}

export function validateCartItemId(value) {
  return positiveInt(value, 'itemId', Number.MAX_SAFE_INTEGER);
}

export function validateQuantity(value) {
  return positiveInt(value, 'quantity', 999);
}
