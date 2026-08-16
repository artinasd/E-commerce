import { ApiError } from './error.js';

export { ApiError };

export function normalizeApiError(error) {
  if (error instanceof ApiError) return error;

  if (error?.code === 'UNAUTHENTICATED') return ApiError.unauthorized();
  if (error?.code === 'FORBIDDEN') return ApiError.forbidden();
  if (error?.code === 'IDENTITY_EXISTS' || error?.code === 'ER_DUP_ENTRY') return ApiError.conflict();
  if (error?.code === 'INVALID_CREDENTIALS') return ApiError.unauthorized('Invalid credentials.');
  if (error?.code === 'INVALID_CURRENT_PASSWORD') return ApiError.badRequest('Current password is incorrect.');
  if (error?.code === 'VALIDATION_ERROR') return ApiError.badRequest(error.message);
  if (error?.code === 'NOT_FOUND') return ApiError.notFound(error.message);
  if (error?.code === 'EMPTY_CART') return ApiError.badRequest('Your cart is empty.');
  if (error?.code === 'INVENTORY_UNAVAILABLE') return ApiError.conflict('One or more products are no longer available.');
  if (error?.code === 'INSUFFICIENT_STOCK' || error?.code === 'INVENTORY_CONFLICT') {
    return ApiError.conflict('One or more products no longer have the requested quantity in stock.');
  }

  return new ApiError('An unexpected server error occurred.');
}

export function apiErrorResponse(error, options = {}) {
  const normalizedOptions = typeof options === 'string'
    ? { log: true, fallbackMessage: options }
    : options;
  const { log = true, fallbackMessage = null } = normalizedOptions ?? {};
  const normalized = normalizeApiError(error);

  if (log && normalized.status >= 500) console.error('[API]', error);

  const headers = { 'Cache-Control': 'no-store' };
  if (normalized.retryAfterSeconds) headers['Retry-After'] = String(normalized.retryAfterSeconds);

  return Response.json({
    success: false,
    error: {
      code: normalized.code,
      message: normalized.status >= 500 && fallbackMessage ? fallbackMessage : normalized.message,
      ...(normalized.details ? { details: normalized.details } : {}),
    },
  }, { status: normalized.status, headers });
}
