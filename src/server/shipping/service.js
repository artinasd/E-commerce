import { query } from '../db/connection.js';

export async function listActiveShippingMethods() {
  const rows = await query(`SELECT id, name, description, price, estimated_min_days, estimated_max_days FROM shipping_methods WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC`);
  return rows.map((row) => ({ id: Number(row.id), name: row.name, description: row.description, price: Number(row.price), estimatedMinDays: row.estimated_min_days == null ? null : Number(row.estimated_min_days), estimatedMaxDays: row.estimated_max_days == null ? null : Number(row.estimated_max_days) }));
}

export async function getActiveShippingMethod(id) {
  const rows = await query(`SELECT id, name, description, price, estimated_min_days, estimated_max_days FROM shipping_methods WHERE id = ? AND is_active = TRUE LIMIT 1`, [id]);
  const row = rows[0];
  return row ? { id: Number(row.id), name: row.name, description: row.description, price: Number(row.price), estimatedMinDays: row.estimated_min_days == null ? null : Number(row.estimated_min_days), estimatedMaxDays: row.estimated_max_days == null ? null : Number(row.estimated_max_days) } : null;
}
