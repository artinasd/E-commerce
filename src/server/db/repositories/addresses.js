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

export async function updateAddress(userId, addressId, input) {
  return withTransaction(async (connection) => {
    const [owned] = await connection.execute(
      `SELECT id FROM addresses WHERE id = ? AND user_id = ? FOR UPDATE`,
      [addressId, userId],
    );
    if (!owned[0]) return false;

    if (input.isDefault) {
      await connection.execute(`UPDATE addresses SET is_default = FALSE WHERE user_id = ?`, [userId]);
    }

    const [result] = await connection.execute(
      `UPDATE addresses
          SET recipient_name = ?, recipient_phone = ?, province = ?, city = ?,
              address_line = ?, postal_code = ?, plaque = ?, unit = ?,
              is_default = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?`,
      [input.recipientName, input.recipientPhone, input.province, input.city, input.addressLine, input.postalCode, input.plaque ?? null, input.unit ?? null, Boolean(input.isDefault), addressId, userId],
    );
    return result.affectedRows === 1;
  });
}

export async function setDefaultAddress(userId, addressId) {
  return withTransaction(async (connection) => {
    const [owned] = await connection.execute(
      `SELECT id FROM addresses WHERE id = ? AND user_id = ? FOR UPDATE`,
      [addressId, userId],
    );
    if (!owned[0]) return false;

    await connection.execute(`UPDATE addresses SET is_default = FALSE WHERE user_id = ?`, [userId]);
    const [result] = await connection.execute(
      `UPDATE addresses SET is_default = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
      [addressId, userId],
    );
    return result.affectedRows === 1;
  });
}

export async function deleteAddress(userId, addressId) {
  return withTransaction(async (connection) => {
    const [rows] = await connection.execute(
      `SELECT is_default FROM addresses WHERE id = ? AND user_id = ? FOR UPDATE`,
      [addressId, userId],
    );
    if (!rows[0]) return false;

    const [deleted] = await connection.execute(
      `DELETE FROM addresses WHERE id = ? AND user_id = ?`,
      [addressId, userId],
    );
    if (deleted.affectedRows !== 1) return false;

    if (rows[0].is_default) {
      const [next] = await connection.execute(
        `SELECT id FROM addresses WHERE user_id = ? ORDER BY updated_at DESC, id DESC LIMIT 1`,
        [userId],
      );
      if (next[0]) {
        await connection.execute(`UPDATE addresses SET is_default = TRUE WHERE id = ? AND user_id = ?`, [next[0].id, userId]);
      }
    }
    return true;
  });
}
