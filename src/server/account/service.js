import { findUserById } from '../db/repositories/users.js';
import { query, withTransaction } from '../db/connection.js';

function publicUser(user) {
  return { id: user.id, email: user.email, phone: user.phone, firstName: user.first_name, lastName: user.last_name, role: user.role };
}

export async function getProfile(userId) {
  const user = await findUserById(userId);
  if (!user) return null;
  return publicUser(user);
}

export async function updateProfile(userId, { firstName, lastName, phone }) {
  return withTransaction(async (connection) => {
    const [result] = await connection.execute(
      `UPDATE users SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? LIMIT 1`,
      [firstName, lastName, phone ?? null, userId],
    );
    if (result.affectedRows !== 1) return null;
    const [rows] = await connection.execute(
      `SELECT id, email, phone, first_name, last_name, role FROM users WHERE id = ? LIMIT 1`,
      [userId],
    );
    return rows[0] ? publicUser(rows[0]) : null;
  });
}

export async function listAddresses(userId) {
  return query(
    `SELECT id, recipient_name, recipient_phone, province, city, address_line, postal_code, is_default, created_at, updated_at
       FROM user_addresses WHERE user_id = ? AND deleted_at IS NULL ORDER BY is_default DESC, updated_at DESC, id DESC`,
    [userId],
  );
}

export async function createAddress(userId, address) {
  return withTransaction(async (connection) => {
    if (address.isDefault) {
      await connection.execute(`UPDATE user_addresses SET is_default = FALSE WHERE user_id = ? AND deleted_at IS NULL`, [userId]);
    }
    const [result] = await connection.execute(
      `INSERT INTO user_addresses (user_id, recipient_name, recipient_phone, province, city, address_line, postal_code, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, address.recipientName, address.recipientPhone, address.province, address.city, address.addressLine, address.postalCode, Boolean(address.isDefault)],
    );
    return Number(result.insertId);
  });
}

export async function deleteAddress(userId, addressId) {
  const [result] = await (await import('../db/connection.js')).query(
    `UPDATE user_addresses SET deleted_at = CURRENT_TIMESTAMP, is_default = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ? AND deleted_at IS NULL LIMIT 1`,
    [addressId, userId],
  ).then((rows) => [{ affectedRows: rows.affectedRows }]);
  return result.affectedRows === 1;
}
