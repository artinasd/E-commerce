import { query, withTransaction } from '../db/connection.js';
import { releaseStock } from '../inventory/service.js';

export async function expirePendingOrder(orderId) {
  return withTransaction(async (connection) => {
    const [orders] = await connection.execute(
      `SELECT id, user_id, status, payment_status, reservation_expires_at
         FROM orders
        WHERE id = ?
        FOR UPDATE`,
      [orderId],
    );
    const order = orders[0];

    if (!order) {
      const error = new Error('Order not found.');
      error.code = 'ORDER_NOT_FOUND';
      throw error;
    }

    if (order.status !== 'PENDING' || order.payment_status !== 'UNPAID') {
      return { expired: false, reason: 'ORDER_NOT_PENDING' };
    }

    if (!order.reservation_expires_at || new Date(order.reservation_expires_at).getTime() > Date.now()) {
      return { expired: false, reason: 'RESERVATION_NOT_EXPIRED' };
    }

    const [items] = await connection.execute(
      `SELECT variant_id, quantity
         FROM order_items
        WHERE order_id = ?`,
      [orderId],
    );

    for (const item of items) {
      await releaseStock(connection, item.variant_id, Number(item.quantity));
    }

    await connection.execute(
      `UPDATE orders
          SET status = 'CANCELLED',
              updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND status = 'PENDING' AND payment_status = 'UNPAID'`,
      [orderId],
    );

    await connection.execute(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
       VALUES (?, 'ORDER_RESERVATION_EXPIRED', 'ORDER', ?, ?)`,
      [order.user_id, orderId, JSON.stringify({ reservationExpiresAt: order.reservation_expires_at })],
    );

    return { expired: true, orderId };
  });
}

/**
 * Lazy cleanup for a customer's expired unpaid reservations.
 * The query only discovers candidates; each expiration is then re-checked
 * and locked transactionally by expirePendingOrder(), making this safe to
 * run repeatedly and concurrently with payment/cancellation flows.
 */
export async function expireExpiredPendingOrdersForUser(userId, limit = 25) {
  const safeLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);
  const candidates = await query(
    `SELECT id
       FROM orders
      WHERE user_id = ?
        AND status = 'PENDING'
        AND payment_status = 'UNPAID'
        AND reservation_expires_at IS NOT NULL
        AND reservation_expires_at <= CURRENT_TIMESTAMP
      ORDER BY reservation_expires_at ASC, id ASC
      LIMIT ${safeLimit}`,
    [userId],
  );

  let expired = 0;
  for (const candidate of candidates) {
    const result = await expirePendingOrder(candidate.id);
    if (result.expired) expired += 1;
  }

  return { checked: candidates.length, expired };
}
