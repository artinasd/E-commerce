import { query, withTransaction } from '../connection.js';

export async function getInventoryByVariantId(variantId) {
  const rows = await query(
    `SELECT id, variant_id, quantity, reserved_quantity, low_stock_threshold,
            GREATEST(quantity - reserved_quantity, 0) AS available_quantity
       FROM inventory
      WHERE variant_id = ?
      LIMIT 1`,
    [variantId],
  );
  return rows[0] ?? null;
}

export async function reserveInventory(connection, variantId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Inventory reservation quantity must be a positive integer.');
  const [result] = await connection.execute(`UPDATE inventory SET reserved_quantity = reserved_quantity + ? WHERE variant_id = ? AND quantity - reserved_quantity >= ?`, [quantity, variantId, quantity]);
  if (result.affectedRows !== 1) throw new Error('Insufficient inventory or inventory record not found.');
}

export async function releaseInventory(connection, variantId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Inventory release quantity must be a positive integer.');
  const [result] = await connection.execute(`UPDATE inventory SET reserved_quantity = reserved_quantity - ? WHERE variant_id = ? AND reserved_quantity >= ?`, [quantity, variantId, quantity]);
  if (result.affectedRows !== 1) throw new Error('Unable to release inventory reservation.');
}

export async function decrementInventory(connection, variantId, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error('Inventory decrement quantity must be a positive integer.');
  const [result] = await connection.execute(`UPDATE inventory SET quantity = quantity - ?, reserved_quantity = reserved_quantity - ? WHERE variant_id = ? AND quantity >= ? AND reserved_quantity >= ?`, [quantity, quantity, variantId, quantity, quantity]);
  if (result.affectedRows !== 1) throw new Error('Unable to decrement inventory.');
}

export async function finalizeOrderInventory(connection, orderId) {
  const [items] = await connection.execute(`SELECT variant_id, quantity FROM order_items WHERE order_id = ? AND variant_id IS NOT NULL FOR UPDATE`, [orderId]);
  for (const item of items) await decrementInventory(connection, Number(item.variant_id), Number(item.quantity));
}

export async function releaseOrderInventory(connection, orderId) {
  const [items] = await connection.execute(`SELECT variant_id, quantity FROM order_items WHERE order_id = ? AND variant_id IS NOT NULL FOR UPDATE`, [orderId]);
  for (const item of items) await releaseInventory(connection, Number(item.variant_id), Number(item.quantity));
}

export async function reserveMultipleInventory(items) {
  return withTransaction(async (connection) => {
    for (const item of items) await reserveInventory(connection, item.variantId, item.quantity);
  });
}
