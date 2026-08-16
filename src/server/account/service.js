import { findUserById } from '../db/repositories/users.js';
import { query, withTransaction } from '../db/connection.js';

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
  };
}

export async function getProfile(userId) {
  const user = await findUserById(userId);
  return user ? publicUser(user) : null;
}

export async function updateProfile(userId, { firstName, lastName, phone }) {
  return withTransaction(async (connection) => {
    const [result] = await connection.execute(
      `UPDATE users
          SET first_name = ?, last_name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND deleted_at IS NULL
        LIMIT 1`,
      [firstName, lastName, phone ?? null, userId],
    );

    if (result.affectedRows !== 1) return null;

    const [rows] = await connection.execute(
      `SELECT id, email, phone, first_name, last_name, role
         FROM users
        WHERE id = ? AND deleted_at IS NULL
        LIMIT 1`,
      [userId],
    );

    return rows[0] ? publicUser(rows[0]) : null;
  });
}

export async function listAddresses(userId) {
  return query(
    `SELECT id, recipient_name, recipient_phone, province, city,
            address_line, postal_code, plaque, unit, is_default,
            created_at, updated_at
       FROM addresses
      WHERE user_id = ?
      ORDER BY is_default DESC, updated_at DESC, id DESC`,
    [userId],
  );
}

export async function createAddress(userId, address) {
  return withTransaction(async (connection) => {
    if (address.isDefault) {
      await connection.execute(
        `UPDATE addresses SET is_default = FALSE WHERE user_id = ?`,
        [userId],
      );
    }

    const [result] = await connection.execute(
      `INSERT INTO addresses (
        user_id, recipient_name, recipient_phone, province, city,
        address_line, postal_code, plaque, unit, is_default
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        address.recipientName,
        address.recipientPhone,
        address.province,
        address.city,
        address.addressLine,
        address.postalCode,
        address.plaque ?? null,
        address.unit ?? null,
        Boolean(address.isDefault),
      ],
    );

    return Number(result.insertId);
  });
}

export async function deleteAddress(userId, addressId) {
  const rows = await query(
    `DELETE FROM addresses
      WHERE id = ? AND user_id = ?`,
    [addressId, userId],
  );

  return rows.affectedRows === 1;
}
