export class AuthError extends Error {
  constructor(message, code = 'AUTHENTICATION_FAILED', status = 401) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.status = status;
  }
}

export class AuthorizationError extends AuthError {
  constructor(message = 'You are not authorized to perform this action.') {
    super(message, 'FORBIDDEN', 403);
  }
}
