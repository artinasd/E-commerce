import { withTransaction, query } from '../db/connection.js';
import { AddressNotFoundError, AddressValidationError } from './errors.js';

const MAX = { recipientName: 120, phone: 30, province: 80, city: 80, addressLine: 500, postalCode: 20, plaque: 30, unit: 30 };

function clean(value, field, required = false) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (required && !text) throw new AddressValidationError(`${field} is required.`);
  if (text.length > MAX[field]) throw new AddressValidationError(`${field} is too long.`);
  return text || null;
}

function normalize(input, partial = false) {
  const out = {};
  const fields = [
    ['recipientName', 'recipient_name', true], ['phone', 'recipient_phone', true], ['province', 'province', true],
    ['city', 'city', true], ['addressLine', 'address_line', true], ['postalCode', 'postal_code', true],
    ['plaque', 'plaque', false], ['unit', 'unit', false],
  ];
  for (const [key, column, required] of fields) {
    if (partial && input[key] === undefined) continue;
    out[column] = clean(input[key], key, required);
  }
  if (input.isDefault !== undefined) out.is_default = Boolean(input.isDefault);
  return out;
}

function map(row) {
  return {
    id: Number(row.id), recipientName: row.recipient_name, phone: row.recipient_phone,
    province: row.province, city: row.city, addressLine: row.address_line,
    postalCode: row.postal_code, plaque: row.plaque, unit: row.unit,
    isDefault: Boolean(row.is_default), createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

export async function listAddresses(userId) {
  const rows = await query(`SELECT id, user_id, recipient_name, recipient_phone, province, city, address_line, postal_code, plaque, unit, is_default, created_at, updated_at FROM addresses WHERE user_id = ? ORDER BY is_default DESC, updated_at DESC, id DESC`, [userId]);
  return rows.map(map);
}

export async function getAddress(userId, addressId) {
  const rows = await query(`SELECT id, user_id, recipient_name, recipient_phone, province, city, address_line, postal_code, plaque, unit, is_default, created_at, updated_at FROM addresses WHERE id = ? AND user_id = ? LIMIT 1`, [addressId, userId]);
  return rows[0] ? map(rows[0]) : null;
}

export async function createAddress(userId, input) {
  const data = normalize(input);
  return withTransaction(async (connection) => {
    const [countRows] = await connection.execute(`SELECT COUNT(*) AS count FROM addresses WHERE user_id = ? FOR UPDATE`, [userId]);
    const shouldDefault = Boolean(data.is_default) || Number(countRows[0].count) === 0;
    if (shouldDefault) await connection.execute(`UPDATE addresses SET is_default = FALSE WHERE user_id = ?`, [userId]);
    const columns = Object.keys(data).filter((key) => key !== 'is_default');
    const values = columns.map((key) => data[key]);
    columns.push('is_default');
    values.push(shouldDefault);
    const placeholders = columns.map(() => '?').join(', ');
    const [result] = await connection.execute(`INSERT INTO addresses (user_id, ${columns.join(', ')}) VALUES (?, ${placeholders})`, [userId, ...values]);
    const [rows] = await connection.execute(`SELECT id, user_id, recipient_name, recipient_phone, province, city, address_line, postal_code, plaque, unit, is_default, created_at, updated_at FROM addresses WHERE id = ? AND user_id = ?`, [result.insertId, userId]);
    return map(rows[0]);
  });
}

export async function updateAddress(userId, addressId, input) {
  const data = normalize(input, true);
  if (!Object.keys(data).length) throw new AddressValidationError('No address fields were provided.');
  return withTransaction(async (connection) => {
    const [existing] = await connection.execute(`SELECT id FROM addresses WHERE id = ? AND user_id = ? FOR UPDATE`, [addressId, userId]);
    if (!existing[0]) throw new AddressNotFoundError();
    if (data.is_default === true) await connection.execute(`UPDATE addresses SET is_default = FALSE WHERE user_id = ?`, [userId]);
    const assignments = Object.keys(data).map((key) => `${key} = ?`).join(', ');
    await connection.execute(`UPDATE addresses SET ${assignments}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`, [...Object.keys(data).map((key) => data[key]), addressId, userId]);
    const [rows] = await connection.execute(`SELECT id, user_id, recipient_name, recipient_phone, province, city, address_line, postal_code, plaque, unit, is_default, created_at, updated_at FROM addresses WHERE id = ? AND user_id = ?`, [addressId, userId]);
    return map(rows[0]);
  });
}

export async function setDefaultAddress(userId, addressId) {
  return withTransaction(async (connection) => {
    const [existing] = await connection.execute(`SELECT id FROM addresses WHERE id = ? AND user_id = ? FOR UPDATE`, [addressId, userId]);
    if (!existing[0]) throw new AddressNotFoundError();
    await connection.execute(`UPDATE addresses SET is_default = FALSE WHERE user_id = ?`, [userId]);
    await connection.execute(`UPDATE addresses SET is_default = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`, [addressId, userId]);
    const [rows] = await connection.execute(`SELECT id, user_id, recipient_name, recipient_phone, province, city, address_line, postal_code, plaque, unit, is_default, created_at, updated_at FROM addresses WHERE id = ? AND user_id = ?`, [addressId, userId]);
    return map(rows[0]);
  });
}

export async function deleteAddress(userId, addressId) {
  return withTransaction(async (connection) => {
    const [existing] = await connection.execute(`SELECT id, is_default FROM addresses WHERE id = ? AND user_id = ? FOR UPDATE`, [addressId, userId]);
    if (!existing[0]) throw new AddressNotFoundError();
    await connection.execute(`DELETE FROM addresses WHERE id = ? AND user_id = ?`, [addressId, userId]);
    if (existing[0].is_default) {
      const [replacement] = await connection.execute(`SELECT id FROM addresses WHERE user_id = ? ORDER BY updated_at DESC, id DESC LIMIT 1 FOR UPDATE`, [userId]);
      if (replacement[0]) await connection.execute(`UPDATE addresses SET is_default = TRUE WHERE id = ? AND user_id = ?`, [replacement[0].id, userId]);
    }
    return { deleted: true };
  });
}
