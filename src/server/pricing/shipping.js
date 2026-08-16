import { query } from '../db/connection.js';

function toMoney(value) {
  const amount = Number(value);
  if (!Number.isSafeInteger(amount) || amount < 0) throw new Error('Invalid shipping amount.');
  return amount;
}

export async function listAvailableShippingMethods(province, subtotal) {
  if (typeof province !== 'string' || !province.trim()) throw new Error('Delivery province is required.');
  const safeSubtotal = toMoney(subtotal);
  return query(`SELECT id, name, code, description, base_amount, free_shipping_minimum FROM shipping_methods WHERE is_active = TRUE AND deleted_at IS NULL AND (free_shipping_minimum IS NULL OR ? >= 0) AND (NOT EXISTS (SELECT 1 FROM shipping_method_provinces smp WHERE smp.shipping_method_id = shipping_methods.id) OR EXISTS (SELECT 1 FROM shipping_method_provinces smp WHERE smp.shipping_method_id = shipping_methods.id AND smp.province = ?)) ORDER BY sort_order ASC, id ASC`, [safeSubtotal, province.trim()]);
}

export function calculateShippingAmount(method, subtotal) {
  const safeSubtotal = toMoney(subtotal);
  const baseAmount = toMoney(method.base_amount);
  const minimum = method.free_shipping_minimum == null ? null : toMoney(method.free_shipping_minimum);
  return minimum !== null && safeSubtotal >= minimum ? 0 : baseAmount;
}

export async function getShippingMethodById(id, province) {
  if (!Number.isSafeInteger(Number(id)) || Number(id) < 1) throw new Error('Invalid shipping method.');
  const rows = await query(`SELECT sm.id, sm.name, sm.code, sm.description, sm.base_amount, sm.free_shipping_minimum FROM shipping_methods sm WHERE sm.id = ? AND sm.is_active = TRUE AND sm.deleted_at IS NULL AND (NOT EXISTS (SELECT 1 FROM shipping_method_provinces smp WHERE smp.shipping_method_id = sm.id) OR EXISTS (SELECT 1 FROM shipping_method_provinces smp WHERE smp.shipping_method_id = sm.id AND smp.province = ?)) LIMIT 1`, [Number(id), province.trim()]);
  if (!rows[0]) throw new Error('Selected shipping method is unavailable for this address.');
  return rows[0];
}
