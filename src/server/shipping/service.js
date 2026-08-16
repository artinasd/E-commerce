import { query } from '../db/connection.js';

function map(row) {
  return {
    id: Number(row.id),
    name: row.name,
    code: row.code,
    description: row.description,
    baseAmount: Number(row.base_amount),
    freeShippingMinimum: row.free_shipping_minimum == null ? null : Number(row.free_shipping_minimum),
  };
}

export async function listActiveShippingMethods(province) {
  const params = [];
  let provinceFilter = '';
  if (province) {
    provinceFilter = `AND (NOT EXISTS (SELECT 1 FROM shipping_method_provinces smp WHERE smp.shipping_method_id = shipping_methods.id) OR EXISTS (SELECT 1 FROM shipping_method_provinces smp WHERE smp.shipping_method_id = shipping_methods.id AND smp.province = ?))`;
    params.push(province.trim());
  }
  const rows = await query(`SELECT id, name, code, description, base_amount, free_shipping_minimum FROM shipping_methods WHERE is_active = TRUE AND deleted_at IS NULL ${provinceFilter} ORDER BY sort_order ASC, id ASC`, params);
  return rows.map(map);
}

export async function getActiveShippingMethod(id, province) {
  const params = [id];
  let provinceFilter = '';
  if (province) {
    provinceFilter = `AND (NOT EXISTS (SELECT 1 FROM shipping_method_provinces smp WHERE smp.shipping_method_id = shipping_methods.id) OR EXISTS (SELECT 1 FROM shipping_method_provinces smp WHERE smp.shipping_method_id = shipping_methods.id AND smp.province = ?))`;
    params.push(province.trim());
  }
  const rows = await query(`SELECT id, name, code, description, base_amount, free_shipping_minimum FROM shipping_methods WHERE id = ? AND is_active = TRUE AND deleted_at IS NULL ${provinceFilter} LIMIT 1`, params);
  return rows[0] ? map(rows[0]) : null;
}
