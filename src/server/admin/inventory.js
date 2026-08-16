import { withTransaction, query } from '../db/connection.js';
import { requireRole } from '../../lib/auth/session.js';

export async function adjustInventory({ variantId, delta, reason = null }) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  const amount = Number(delta);
  if (!Number.isInteger(amount) || amount === 0) throw new Error('Inventory adjustment must be a non-zero integer.');
  return withTransaction(async (connection) => {
    const [rows] = await connection.execute(`SELECT i.id, i.variant_id, i.quantity, i.reserved_quantity, i.low_stock_threshold, v.sku, v.name AS variant_name, p.name AS product_name FROM inventory i INNER JOIN product_variants v ON v.id = i.variant_id INNER JOIN products p ON p.id = v.product_id WHERE i.variant_id = ? FOR UPDATE`, [variantId]);
    const current = rows[0];
    if (!current) throw new Error('Inventory record not found.');
    const nextQuantity = Number(current.quantity) + amount;
    if (nextQuantity < Number(current.reserved_quantity)) throw new Error('Inventory quantity cannot be below reserved quantity.');
    await connection.execute('UPDATE inventory SET quantity = ? WHERE variant_id = ?', [nextQuantity, variantId]);
    return { ...current, quantity: nextQuantity, adjustment: amount, reason };
  });
}

export async function listAdminInventory({ search = null, limit = 50, offset = 0 } = {}) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  const params = [];
  const conditions = ['p.deleted_at IS NULL'];
  if (search) { conditions.push('(p.name LIKE ? OR v.sku LIKE ? OR v.name LIKE ?)'); const pattern = `%${search}%`; params.push(pattern, pattern, pattern); }
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  return query(`SELECT i.id, i.variant_id, p.id AS product_id, p.name AS product_name, v.sku, v.name AS variant_name, i.quantity, i.reserved_quantity, GREATEST(i.quantity - i.reserved_quantity, 0) AS available_quantity, i.low_stock_threshold FROM inventory i INNER JOIN product_variants v ON v.id = i.variant_id INNER JOIN products p ON p.id = v.product_id WHERE ${conditions.join(' AND ')} ORDER BY (i.quantity - i.reserved_quantity) ASC, p.name ASC LIMIT ${safeLimit} OFFSET ${safeOffset}`, params);
}
