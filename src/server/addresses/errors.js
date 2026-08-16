export class AddressError extends Error {
  constructor(message, code = 'ADDRESS_ERROR', status = 400) {
    super(message);
    this.name = 'AddressError';
    this.code = code;
    this.status = status;
  }
}

export class AddressNotFoundError extends AddressError {
  constructor() { super('Address not found.', 'ADDRESS_NOT_FOUND', 404); }
}

export class AddressValidationError extends AddressError {
  constructor(message) { super(message, 'INVALID_ADDRESS', 400); }
}
