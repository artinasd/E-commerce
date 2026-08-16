export class ApiError extends Error {
  constructor(message, status = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message = 'Invalid request.', details = null) {
    return new ApiError(message, 400, 'BAD_REQUEST', details);
  }

  static unauthorized(message = 'Authentication required.') {
    return new ApiError(message, 401, 'UNAUTHENTICATED');
  }

  static forbidden(message = 'You do not have permission to perform this action.') {
    return new ApiError(message, 403, 'FORBIDDEN');
  }

  static notFound(message = 'Resource not found.') {
    return new ApiError(message, 404, 'NOT_FOUND');
  }

  static conflict(message = 'The request conflicts with the current resource state.') {
    return new ApiError(message, 409, 'CONFLICT');
  }

  static tooManyRequests(message = 'Too many requests. Please try again later.', retryAfterSeconds = null) {
    const error = new ApiError(message, 429, 'RATE_LIMITED');
    error.retryAfterSeconds = retryAfterSeconds;
    return error;
  }
}

export function normalizeApiError(error) {
  if (error instanceof ApiError) return error;

  if (error?.code === 'UNAUTHENTICATED') return ApiError.unauthorized();
  if (error?.code === 'FORBIDDEN') return ApiError.forbidden();
  if (error?.code === 'IDENTITY_EXISTS' || error?.code === 'ER_DUP_ENTRY') return ApiError.conflict();
  if (error?.code === 'INVALID_CREDENTIALS') return ApiError.unauthorized('Invalid credentials.');
  if (error?.code === 'INVALID_CURRENT_PASSWORD') return ApiError.badRequest('Current password is incorrect.');

  return new ApiError('An unexpected server error occurred.');
}

export function apiErrorResponse(error, { log = true } = {}) {
  const normalized = normalizeApiError(error);

  if (log && normalized.status >= 500) {
    console.error('[API]', error);
  }

  const headers = { 'Cache-Control': 'no-store' };
  if (normalized.retryAfterSeconds) {
    headers['Retry-After'] = String(normalized.retryAfterSeconds);
  }

  return Response.json({
    success: false,
    error: {
      code: normalized.code,
      message: normalized.message,
      ...(normalized.details ? { details: normalized.details } : {}),
    },
  }, { status: normalized.status, headers });
}
