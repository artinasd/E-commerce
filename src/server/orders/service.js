import crypto from 'node:crypto';
import { getOrCreateCart, listCartItems } from '../db/repositories/cart.js';
import { createOrder, findOrderByIdForUser, listOrderItems, listOrdersForUser } from '../db/repositories/orders.js';
import { query, withTransaction } from '../db/connection.js';

function money(value) {
  return Number(Number(value).toFixed(2));
}

function createOrderNumber() {
  return `IR${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

export async function listUserOrders(userId, params) {
  const orders = await listOrdersForUser(userId, params);
  return {
    orders: orders.map((order) => ({
      ...order,
      subtotal: money(order.subtotal),
      discountAmount: money(order.discount_amount),
      shippingAmount: money(order.shipping_amount),
      totalAmount: money(order.total_amount),
    })),
    pagination: {
      page: params.page,
      limit: params.limit,
      hasMore: orders.length === params.limit,
    },
  };
}

export async function getUserOrder(userId, orderId) {
  const order = await findOrderByIdForUser(orderId, userId);
  if (!order) return null;

  const items = await listOrderItems(order.id);
  return {
    ...order,
    subtotal: money(order.subtotal),
    discountAmount: money(order.discount_amount),
    shippingAmount: money(order.shipping_amount),
    totalAmount: money(order.total_amount),
    items: items.map((item) => ({
      ...item,
      unitPrice: money(item.unit_price),
      discountAmount: money(item.discount_amount),
      lineTotal: money(item.line_total),
    })),
  };
}

export async function checkout(userId, shipping) {
  const cart = await getOrCreateCart(userId);
  const items = await listCartItems(cart.id);
  if (!items.length) {
    const error = new Error('Your cart is empty.');
    error.code = 'EMPTY_CART';
    throw error;
  }

  return withTransaction(async (connection) => {
    const lockedItems = [];
    for (const item of items) {
      const [rows] = await connection.execute(
        `SELECT cv.id, cv.product_id, cv.sku, cv.name AS variant_name,
                cv.price, cv.stock_quantity, cv.is_active,
                p.name AS product_name
           FROM product_variants cv
           INNER JOIN products p ON p.id = cv.product_id
          WHERE cv.id = ? AND p.deleted_at IS NULL
          FOR UPDATE`,
        [item.variant_id],
      );

      const variant = rows[0];
      if (!variant || !variant.is_active) {
        const error = new Error(`Product variant ${item.variant_id} is unavailable.`);
        error.code = 'INVENTORY_UNAVAILABLE';
        throw error;
      }
      if (Number(variant.stock_quantity) < Number(item.quantity)) {
        const error = new Error(`Insufficient stock for ${variant.product_name ?? variant.product_name}.`);
        error.code = 'INSUFFICIENT_STOCK';
        throw error;
      }
      lockedItems.push({ variant, quantity: Number(item.quantity) });
    }

    const subtotal = money(lockedItems.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0));
    const shippingAmount = 0;
    const discountAmount = 0;
    const totalAmount = money(subtotal - discountAmount + shippingAmount);
    const orderNumber = createOrderNumber();

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (
        user_id, order_number, status, payment_status,
        subtotal, discount_amount, shipping_amount, total_amount,
        shipping_recipient_name, shipping_recipient_phone,
        shipping_province, shipping_city, shipping_address,
        shipping_postal_code, placed_at
      ) VALUES (?, ?, 'PENDING', 'UNPAID', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [userId, orderNumber, subtotal, discountAmount, shippingAmount, totalAmount,
        shipping.recipientName, shipping.recipientPhone, shipping.province,
        shipping.city, shipping.addressLine, shipping.postalCode],
    );

    for (const { variant, quantity } of lockedItems) {
      const unitPrice = money(variant.price);
      const lineTotal = money(unitPrice * quantity);

      await connection.execute(
        `INSERT INTO order_items (
          order_id, variant_id, product_name, sku,
          unit_price, quantity, discount_amount, line_total
        ) VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
        [orderResult.insertId, variant.id, variant.product_name, variant.sku, unitPrice, quantity, lineTotal],
      );

      const [stockResult] = await connection.execute(
        `UPDATE product_variants
            SET stock_quantity = stock_quantity - ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND stock_quantity >= ? AND is_active = TRUE`,
        [quantity, variant.id, quantity],
      );

      if (stockResult.affectedRows !== 1) {
        const error = new Error('Inventory changed while processing the order.');
        error.code = 'INVENTORY_CONFLICT';
        throw error;
      }
    }

    await connection.execute(
      `DELETE FROM cart_items WHERE cart_id = ?`,
      [cart.id],
    );

    return {
      id: Number(orderResult.insertId),
      orderNumber,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      subtotal,
      discountAmount,
      shippingAmount,
      totalAmount,
    };
  });
}
