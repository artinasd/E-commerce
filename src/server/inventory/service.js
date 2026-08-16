import { InsufficientStockError, InventoryError } from './errors.js';

function assertPositiveInteger(value, fieldName) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new InventoryError(`${fieldName} must be a positive integer.`, 'INVALID_INVENTORY_QUANTITY');
  }
}

function assertConnection(connection) {
  if (!connection || typeof connection.execute !== 'function') {
    throw new InventoryError('A database transaction connection is required.', 'INVENTORY_TRANSACTION_REQUIRED');
  }
}

export async function getAvailableStock(connection, variantId) {
  assertConnection(connection);
  const [rows] = await connection.execute(
    `SELECT quantity, reserved_quantity
       FROM inventory
      WHERE variant_id = ?
      FOR UPDATE`,
    [variantId],
  );

  if (!rows[0]) {
    throw new InventoryError('Inventory record not found.', 'INVENTORY_NOT_FOUND');
  }

  return Number(rows[0].quantity) - Number(rows[0].reserved_quantity);
}

export async function reserveStock(connection, variantId, quantity) {
  assertConnection(connection);
  assertPositiveInteger(quantity, 'quantity');

  const [result] = await connection.execute(
    `UPDATE inventory
        SET reserved_quantity = reserved_quantity + ?
      WHERE variant_id = ?
        AND reserved_quantity + ? <= quantity`,
    [quantity, variantId, quantity],
  );

  if (result.affectedRows !== 1) {
    const [rows] = await connection.execute(
      'SELECT id FROM inventory WHERE variant_id = ? FOR UPDATE',
      [variantId],
    );

    if (!rows[0]) {
      throw new InventoryError('Inventory record not found.', 'INVENTORY_NOT_FOUND');
    }

    throw new InsufficientStockError();
  }

  return { variantId, quantityReserved: quantity };
}

export async function releaseStock(connection, variantId, quantity) {
  assertConnection(connection);
  assertPositiveInteger(quantity, 'quantity');

  const [result] = await connection.execute(
    `UPDATE inventory
        SET reserved_quantity = reserved_quantity - ?
      WHERE variant_id = ?
        AND reserved_quantity >= ?`,
    [quantity, variantId, quantity],
  );

  if (result.affectedRows !== 1) {
    const [rows] = await connection.execute(
      'SELECT id, reserved_quantity FROM inventory WHERE variant_id = ? FOR UPDATE',
      [variantId],
    );

    if (!rows[0]) {
      throw new InventoryError('Inventory record not found.', 'INVENTORY_NOT_FOUND');
    }

    throw new InventoryError('Cannot release more stock than is reserved.', 'INVALID_RESERVATION_RELEASE');
  }

  return { variantId, quantityReleased: quantity };
}

export async function consumeReservedStock(connection, variantId, quantity) {
  assertConnection(connection);
  assertPositiveInteger(quantity, 'quantity');

  const [result] = await connection.execute(
    `UPDATE inventory
        SET quantity = quantity - ?,
            reserved_quantity = reserved_quantity - ?
      WHERE variant_id = ?
        AND reserved_quantity >= ?
        AND quantity >= ?`,
    [quantity, quantity, variantId, quantity, quantity],
  );

  if (result.affectedRows !== 1) {
    const [rows] = await connection.execute(
      'SELECT id, quantity, reserved_quantity FROM inventory WHERE variant_id = ? FOR UPDATE',
      [variantId],
    );

    if (!rows[0]) {
      throw new InventoryError('Inventory record not found.', 'INVENTORY_NOT_FOUND');
    }

    throw new InventoryError('Reserved stock cannot be consumed for this quantity.', 'INVALID_RESERVATION_CONSUMPTION');
  }

  return { variantId, quantityConsumed: quantity };
}
