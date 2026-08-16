export class CartError extends Error {
  constructor(message, code = 'CART_ERROR') {
    super(message);
    this.name = 'CartError';
    this.code = code;
  }
}

export class CartItemNotFoundError extends CartError {
  constructor() { super('Cart item not found.', 'CART_ITEM_NOT_FOUND'); }
}

export class CartVariantUnavailableError extends CartError {
  constructor() { super('This product variant is unavailable.', 'CART_VARIANT_UNAVAILABLE'); }
}

export class CartQuantityError extends CartError {
  constructor(message = 'Invalid cart quantity.') { super(message, 'INVALID_CART_QUANTITY'); }
}

export class CartStockError extends CartError {
  constructor() { super('Requested quantity exceeds available stock.', 'CART_STOCK_LIMIT'); }
}
