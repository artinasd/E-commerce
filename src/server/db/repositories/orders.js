import { query, withTransaction } from '../connection.js';

export async function findOrderByIdForUser(orderId, userId) {
  const rows = await query(
    `SELECT id, user_id, order_number, status, payment_status,
            subtotal, discount_amount, shipping_amount, total_amount,
            shipping_recipient_name, shipping_recipient_phone,
            shipping_province, shipping_city, shipping_address,
            shipping_postal_code, placed_at, created_at, updated_at
       FROM orders
      WHERE id = ? AND user_id = ?
      LIMIT 1`,
    [orderId, userId],
  );
  return rows[0] ?? null;
}

export async function findOrderByNumberForUser(orderNumber, userId) {
  const rows = await query(
    `SELECT id, user_id, order_number, status, payment_status,
            subtotal, discount_amount, shipping_amount, total_amount,
            shipping_recipient_name, shipping_recipient_phone,
            shipping_province, shipping_city, shipping_address,
            shipping_postal_code, placed_at, created_at, updated_at
       FROM orders
      WHERE order_number = ? AND user_id = ?
      LIMIT 1`,
    [orderNumber, userId],
  );
  return rows[0] ?? null;
}

export async function listOrdersForUser(userId, { limit = 20, offset = 0 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  return query(
    `SELECT id, order_number, status, payment_status,
            subtotal, discount_amount, shipping_amount, total_amount,
            placed_at, created_at, updated_at
       FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC, id DESC
      LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    [userId],
  );
}

export async function listOrderItems(orderId) {
  return query(
    `SELECT id, order_id, variant_id, product_name, sku,
            unit_price, quantity, discount_amount, line_total, created_at
       FROM order_items
      WHERE order_id = ?
      ORDER BY id ASC`,
    [orderId],
  );
}

export async function createOrder({
  userId,
  orderNumber,
  subtotal,
  discountAmount = 0,
  shippingAmount = 0,
  totalAmount,
  shipping,
  items,
}) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('An order must contain at least one item.');
  }

  return withTransaction(async (connection) => {
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (
        user_id, order_number, status, payment_status,
        subtotal, discount_amount, shipping_amount, total_amount,
        shipping_recipient_name, shipping_recipient_phone,
        shipping_province, shipping_city, shipping_address,
        shipping_postal_code, placed_at
      ) VALUES (?, ?, 'PENDING', 'UNPAID', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        userId,
        orderNumber,
        subtotal,
        discountAmount,
        shippingAmount,
        totalAmount,
        shipping.recipientName,
        shipping.recipientPhone,
        shipping.province,
        shipping.city,
        shipping.addressLine,
        shipping.postalCode,
      ],
    );

    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items (
          order_id, variant_id, product_name, sku,
          unit_price, quantity, discount_amount, line_total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderResult.insertId,
          item.variantId ?? null,
          item.productName,
          item.sku,
          item.unitPrice,
          item.quantity,
          item.discountAmount ?? 0,
          item.lineTotal,
        ],
      );
    }

    return Number(orderResult.insertId);
  });
}
