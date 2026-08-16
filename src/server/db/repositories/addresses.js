import { query, withTransaction } from '../connection.js';

export async function listAddresses(userId) {
  return query(
    `SELECT id, recipient_name, recipient_phone, province, city, address_line,
            postal_code, plaque, unit, is_default, created_at, updated_at
       FROM addresses
      WHERE user_id = ?
      ORDER BY is_default DESC, updated_at DESC, id DESC`,
    [userId],
  );
}

export async function findAddressForUser(userId, addressId) {
  const rows = await query(
    `SELECT id, recipient_name, recipient_phone, province, city, address_line,
            postal_code, plaque, unit, is_default
       FROM addresses
      WHERE id = ? AND user_id = ?
      LIMIT 1`,
    [addressId, userId],
  );
  return rows[0] ?? null;
}

export async function createAddress(userId, input) {
  return withTransaction(async (connection) => {
    if (input.isDefault) {
      await connection.execute(`UPDATE addresses SET is_default = FALSE WHERE user_id = ?`, [userId]);
    }

    const [result] = await connection.execute(
      `INSERT INTO addresses
        (user_id, recipient_name, recipient_phone, province, city, address_line, postal_code, plaque, unit, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, input.recipientName, input.recipientPhone, input.province, input.city, input.addressLine, input.postalCode, input.plaque || null, input.unit || null, Boolean(input.isDefault)],
    );

    const [rows] = await connection.execute(
      `SELECT id, recipient_name, recipient_phone, province, city, address_line,
              postal_code, plaque, unit, is_default
         FROM addresses WHERE id = ? AND user_id = ? LIMIT 1`,
      [result.insertId, userId],
    );
    return rows[0];
  });
}
