export function jsonResponse(data, status = 200, headers = {}) {
  return Response.json(data, { status, headers });
}

export function errorResponse(error) {
  const statusByCode = {
    UNAUTHENTICATED: 401,
    INVALID_CREDENTIALS: 401,
    ACCOUNT_EXISTS: 409,
    VALIDATION_ERROR: 400,
    ORDER_NOT_FOUND: 404,
    ORDER_CANCELLATION_NOT_ALLOWED: 409,
    PAYMENT_NOT_FOUND: 404,
    PAYMENT_PROVIDER_UNAVAILABLE: 503,
    INSUFFICIENT_STOCK: 409,
  };
  const status = statusByCode[error?.code] ?? 500;
  if (status === 500) console.error(error);
  return Response.json({ error: { code: error?.code ?? 'INTERNAL_ERROR', message: error?.message ?? 'An unexpected error occurred.' } }, { status });
}
