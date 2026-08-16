export class DatabaseError extends Error {
  constructor(message, options = {}) {
    super(message, options);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found.') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  constructor(message = 'The requested operation conflicts with existing data.') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class InsufficientInventoryError extends Error {
  constructor(message = 'The requested quantity is not available.') {
    super(message);
    this.name = 'InsufficientInventoryError';
  }
}

export function normalizeDatabaseError(error) {
  if (!error) return new DatabaseError('Unknown database error.');

  if (error.code === 'ER_DUP_ENTRY') {
    return new ConflictError('A record with the same unique value already exists.');
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_ROW_IS_REFERENCED_2') {
    return new ConflictError('The requested database relationship is invalid.');
  }

  return new DatabaseError('A database operation failed.', { cause: error });
}
