import { withTransaction } from '../db/connection.js';
import { releaseStock } from '../inventory/service.js';
import { findOrderByIdForUser, listOrderItems, listOrdersForUser } from '../db/repositories/orders.js';
import { assertValidOrderStatusTransition, canCustomerCancelOrder } from './status.js';

function money(value) {
  return Number(value);
}

export async function listUserOrders(userId, params) {
  const orders = await listOrdersForUser(userId, params);
  return {
    orders: orders.map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      paymentStatus: order.payment_status,
      subtotal: money(order.subtotal),
      discountAmount: money(order.discount_amount),
      shippingAmount: money(order.shipping_amount),
      totalAmount: money(order.total_amount),
      placedAt: order.placed_at,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    })),
    pagination: { page: params.page, limit: params.limit, hasMore: orders.length === params.limit },
  };
}

export async function getUserOrder(userId, orderId) {
  const order = await findOrderByIdForUser(orderId, userId);
  if (!order) return null;
  const items = await listOrderItems(order.id);
  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    paymentStatus: order.payment_status,
    subtotal: money(order.subtotal),
    discountAmount: money(order.discount_amount),
    shippingAmount: money(order.shipping_amount),
    totalAmount: money(order.total_amount),
    shippingAddress: {
      recipientName: order.shipping_recipient_name,
      recipientPhone: order.shipping_recipient_phone,
      province: order.shipping_province,
      city: order.shipping_city,
      addressLine: order.shipping_address,
      postalCode: order.shipping_postal_code,
    },
    placedAt: order.placed_at,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    items: items.map((item) => ({
      id: item.id,
      variantId: item.variant_id,
      productName: item.product_name,
      sku: item.sku,
      unitPrice: money(item.unit_price),
      quantity: Number(item.quantity),
      discountAmount: money(item.discount_amount),
      lineTotal: money(item.line_total),
    })),
  };
}

export async function transitionOrderStatus({ orderId, actorUserId = null, targetStatus, actorRole = 'CUSTOMER', reason = null }) {
  return withTransaction(async (connection) => {
    const [rows] = await connection.execute(
      `SELECT id, user_id, status, payment_status, total_amount
         FROM orders WHERE id = ? FOR UPDATE`,
      [orderId],
    );
    const order = rows[0];
    if (!order) {
      const error = new Error('Order not found.');
      error.code = 'ORDER_NOT_FOUND';
      throw error;
    }
    if (actorRole === 'CUSTOMER' && Number(order.user_id) !== Number(actorUserId)) {
      const error = new Error('Order not found.');
      error.code = 'ORDER_NOT_FOUND';
      throw error;
    }
    if (targetStatus === 'CANCELLED' && actorRole === 'CUSTOMER' && !canCustomerCancelOrder(order)) {
      const error = new Error('This order can no longer be cancelled.');
      error.code = 'ORDER_CANCELLATION_NOT_ALLOWED';
      throw error;
    }
    assertValidOrderStatusTransition(order.status, targetStatus);
    if (targetStatus === 'CANCELLED' && order.payment_status === 'PAID') {
      const error = new Error('Paid orders require a refund workflow before cancellation.');
      error.code = 'PAID_ORDER_REQUIRES_REFUND';
      throw error;
    }
    if (targetStatus === 'CONFIRMED' && order.payment_status !== 'PAID') {
      const error = new Error('Only paid orders can be confirmed.');
      error.code = 'ORDER_PAYMENT_REQUIRED';
      throw error;
    }

    if (targetStatus === 'CANCELLED') {
      const [items] = await connection.execute(
        `SELECT variant_id, quantity FROM order_items WHERE order_id = ?`,
        [orderId],
      );
      for (const item of items) {
        await releaseStock(connection, item.variant_id, Number(item.quantity));
      }
    }

    await connection.execute(
      `UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [targetStatus, orderId],
    );
    await connection.execute(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
       VALUES (?, ?, 'ORDER', ?, ?)`,
      [actorUserId, 'ORDER_STATUS_CHANGED', orderId, JSON.stringify({ from: order.status, to: targetStatus, reason })],
    );
    return { ...order, status: targetStatus };
  });
}

export async function cancelCustomerOrder({ orderId, userId, reason = null }) {
  return transitionOrderStatus({ orderId, actorUserId: userId, targetStatus: 'CANCELLED', actorRole: 'CUSTOMER', reason });
}
