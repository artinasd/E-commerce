export class InventoryError extends Error {
  constructor(message, code = 'INVENTORY_ERROR') {
    super(message);
    this.name = 'InventoryError';
    this.code = code;
  }
}

export class InsufficientStockError extends InventoryError {
  constructor(message = 'Insufficient stock.') {
    super(message, 'INSUFFICIENT_STOCK');
  }
}
