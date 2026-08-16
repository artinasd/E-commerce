import { query, withTransaction } from '../connection.js';

const MAX_CART_ITEM_QUANTITY = 99;

function assertQuantity(quantity) {
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > MAX_CART_ITEM_QUANTITY) {
    throw new Error(`Cart quantity must be an integer between 1 and ${MAX_CART_ITEM_QUANTITY}.`);
  }
}

export async function findCartByUserId(userId) {
  const rows = await query(`SELECT id, user_id, created_at, updated_at FROM carts WHERE user_id = ? LIMIT 1`, [userId]);
  return rows[0] ?? null;
}

export async function createCart(userId) {
  const result = await query(`INSERT INTO carts (user_id) VALUES (?)`, [userId]);
  return findCartByUserId(userId).then((cart) => ({ ...cart, id: result.insertId }));
}

export async function getOrCreateCart(userId) {
  const existing = await findCartByUserId(userId);
  if (existing) return existing;
  try { return await createCart(userId); } catch (error) {
    if (error?.code !== 'ER_DUP_ENTRY') throw error;
    return findCartByUserId(userId);
  }
}

export async function listCartItems(cartId) {
  return query(`SELECT ci.id, ci.cart_id, ci.variant_id, ci.quantity, p.id AS product_id, p.name AS product_name, p.slug AS product_slug, v.sku, v.name AS variant_name, v.price, v.compare_at_price, pi.url AS primary_image_url, GREATEST(COALESCE(i.quantity, 0) - COALESCE(i.reserved_quantity, 0), 0) AS available_quantity FROM cart_items ci INNER JOIN product_variants v ON v.id = ci.variant_id AND v.is_active = TRUE INNER JOIN products p ON p.id = v.product_id AND p.deleted_at IS NULL LEFT JOIN inventory i ON i.variant_id = v.id LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.variant_id = v.id AND pi.is_primary = TRUE WHERE ci.cart_id = ? ORDER BY ci.created_at ASC, ci.id ASC`, [cartId]);
}

export async function addCartItem(userId, variantId, quantity) {
  assertQuantity(quantity);
  return withTransaction(async (connection) => {
    const [cartRows] = await connection.execute(`SELECT id FROM carts WHERE user_id = ? LIMIT 1 FOR UPDATE`, [userId]);
    if (cartRows.length === 0) await connection.execute(`INSERT INTO carts (user_id) VALUES (?)`, [userId]);
    const [resolvedCartRows] = await connection.execute(`SELECT id FROM carts WHERE user_id = ? LIMIT 1 FOR UPDATE`, [userId]);
    const cartId = resolvedCartRows[0].id;
    const [variantRows] = await connection.execute(`SELECT v.id, GREATEST(COALESCE(i.quantity, 0) - COALESCE(i.reserved_quantity, 0), 0) AS available_quantity FROM product_variants v LEFT JOIN inventory i ON i.variant_id = v.id WHERE v.id = ? AND v.is_active = TRUE LIMIT 1 FOR UPDATE`, [variantId]);
    const variant = variantRows[0];
    if (!variant) throw new Error('Product variant not found.');
    const [existingRows] = await connection.execute(`SELECT id, quantity FROM cart_items WHERE cart_id = ? AND variant_id = ? FOR UPDATE`, [cartId, variantId]);
    const nextQuantity = (existingRows[0]?.quantity ?? 0) + quantity;
    if (nextQuantity > MAX_CART_ITEM_QUANTITY) throw new Error(`Cart quantity cannot exceed ${MAX_CART_ITEM_QUANTITY}.`);
    if (nextQuantity > Number(variant.available_quantity)) throw new Error('Requested quantity exceeds available inventory.');
    if (existingRows[0]) await connection.execute(`UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [nextQuantity, existingRows[0].id]);
    else await connection.execute(`INSERT INTO cart_items (cart_id, variant_id, quantity) VALUES (?, ?, ?)`, [cartId, variantId, quantity]);
    return cartId;
  });
}

export async function updateCartItem(userId, itemId, quantity) {
  assertQuantity(quantity);
  return withTransaction(async (connection) => {
    const [rows] = await connection.execute(
      `SELECT ci.id, ci.variant_id,
              GREATEST(COALESCE(i.quantity, 0) - COALESCE(i.reserved_quantity, 0), 0) AS available_quantity
         FROM cart_items ci
         INNER JOIN carts c ON c.id = ci.cart_id AND c.user_id = ?
         INNER JOIN product_variants v ON v.id = ci.variant_id AND v.is_active = TRUE
         LEFT JOIN inventory i ON i.variant_id = v.id
        WHERE ci.id = ?
        FOR UPDATE`,
      [userId, itemId],
    );
    if (!rows[0]) throw new Error('Cart item not found or product is unavailable.');
    if (quantity > Number(rows[0].available_quantity)) throw new Error('Requested quantity exceeds available inventory.');
    const [result] = await connection.execute(`UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [quantity, itemId]);
    if (result.affectedRows !== 1) throw new Error('Cart item could not be updated.');
  });
}

export async function removeCartItem(userId, itemId) {
  const result = await query(`DELETE ci FROM cart_items ci INNER JOIN carts c ON c.id = ci.cart_id WHERE ci.id = ? AND c.user_id = ?`, [itemId, userId]);
  return result.affectedRows > 0;
}
