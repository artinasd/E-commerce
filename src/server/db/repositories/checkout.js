import { randomUUID } from 'node:crypto';
import { withTransaction } from '../connection.js';
import { calculateOrderPricing } from '../../pricing/service.js';

const RESERVATION_MINUTES = 30;

function makeOrderNumber() {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function placeOrderFromCart(userId, addressId) {
  return withTransaction(async (connection) => {
    const [addressRows] = await connection.execute(
      `SELECT id, recipient_name, recipient_phone, province, city, address_line, postal_code
         FROM addresses WHERE id = ? AND user_id = ? LIMIT 1`,
      [addressId, userId],
    );
    const address = addressRows[0];
    if (!address) throw new Error('Shipping address not found.');

    const [cartRows] = await connection.execute(`SELECT id FROM carts WHERE user_id = ? LIMIT 1 FOR UPDATE`, [userId]);
    if (!cartRows[0]) throw new Error('Your cart is empty.');

    const [items] = await connection.execute(
      `SELECT ci.id AS cart_item_id, ci.variant_id, ci.quantity,
              p.id AS product_id, p.name AS product_name, v.sku, v.price,
              GREATEST(COALESCE(i.quantity, 0) - COALESCE(i.reserved_quantity, 0), 0) AS available_quantity
         FROM cart_items ci
         INNER JOIN product_variants v ON v.id = ci.variant_id AND v.is_active = TRUE
         INNER JOIN products p ON p.id = v.product_id AND p.status = 'ACTIVE' AND p.deleted_at IS NULL
         LEFT JOIN inventory i ON i.variant_id = v.id
        WHERE ci.cart_id = ? FOR UPDATE`,
      [cartRows[0].id],
    );
    if (!items.length) throw new Error('Your cart is empty.');

    for (const item of items) {
      if (Number(item.quantity) > Number(item.available_quantity)) {
        throw new Error(`Insufficient inventory for ${item.product_name}.`);
      }
    }

    const pricing = calculateOrderPricing(items);
    const number = makeOrderNumber();
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (
        user_id, order_number, status, payment_status, subtotal, discount_amount,
        shipping_amount, total_amount, shipping_recipient_name, shipping_recipient_phone,
        shipping_province, shipping_city, shipping_address, shipping_postal_code,
        placed_at, reservation_expires_at
      ) VALUES (?, ?, 'PENDING', 'UNPAID', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? MINUTE))`,
      [userId, number, pricing.subtotal, pricing.discountAmount, pricing.shippingAmount, pricing.totalAmount, address.recipient_name, address.recipient_phone, address.province, address.city, address.address_line, address.postal_code, RESERVATION_MINUTES],
    );

    for (const item of pricing.items) {
      await connection.execute(
        `INSERT INTO order_items (order_id, variant_id, product_name, sku, unit_price, quantity, discount_amount, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderResult.insertId, item.variant_id, item.product_name, item.sku, item.unitPrice, item.quantity, item.discountAmount, item.lineTotal],
      );

      const [reserved] = await connection.execute(
        `UPDATE inventory SET reserved_quantity = reserved_quantity + ?
          WHERE variant_id = ? AND quantity - reserved_quantity >= ?`,
        [item.quantity, item.variant_id, item.quantity],
      );
      if (reserved.affectedRows !== 1) throw new Error(`Inventory changed for ${item.product_name}. Please try again.`);
    }

    await connection.execute(`DELETE FROM cart_items WHERE cart_id = ?`, [cartRows[0].id]);

    return {
      id: Number(orderResult.insertId),
      orderNumber: number,
      totalAmount: pricing.totalAmount,
      reservationExpiresAt: new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000),
    };
  });
}
