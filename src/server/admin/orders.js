import { query, withTransaction } from '../db/connection.js';
import { requireRole } from '../../lib/auth/session.js';
import { releaseStock } from '../inventory/service.js';
import { assertValidOrderStatusTransition } from '../orders/status.js';

const roles = () => requireRole(['ADMIN', 'SUPER_ADMIN']);
const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
const paymentStatuses = ['UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'];

export async function listAdminOrders({ search = null, status = null, limit = 50, offset = 0 } = {}) {
  await roles(); const params = []; const where = ['1=1'];
  if (search) { where.push('(o.order_number LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)'); const q = `%${search}%`; params.push(q, q, q); }
  if (status && statuses.includes(status)) { where.push('o.status = ?'); params.push(status); }
  const l = Math.min(Math.max(Number(limit) || 50, 1), 100); const off = Math.max(Number(offset) || 0, 0);
  return query(`SELECT o.id, o.order_number, o.status, o.payment_status, o.total_amount, o.created_at, o.placed_at, u.id AS user_id, u.email, u.phone FROM orders o INNER JOIN users u ON u.id=o.user_id WHERE ${where.join(' AND ')} ORDER BY o.created_at DESC, o.id DESC LIMIT ${l} OFFSET ${off}`, params);
}

export async function getAdminOrder(orderId) {
  await roles();
  const [orders, items, payments] = await Promise.all([
    query(`SELECT o.*, u.email AS user_email, u.phone AS user_phone FROM orders o INNER JOIN users u ON u.id=o.user_id WHERE o.id=? LIMIT 1`, [orderId]),
    query(`SELECT id, variant_id, product_name, sku, unit_price, quantity, discount_amount, line_total FROM order_items WHERE order_id=? ORDER BY id ASC`, [orderId]),
    query(`SELECT id, provider, provider_reference, amount, status, paid_at, created_at FROM payments WHERE order_id=? ORDER BY id DESC`, [orderId]),
  ]);
  return orders[0] ? { order: orders[0], items, payments } : null;
}

export async function setAdminOrderStatus(orderId, status) {
  const actor = await roles();
  if (!statuses.includes(status)) throw new Error('Invalid order status.');
  return withTransaction(async (connection) => {
    const [rows] = await connection.execute('SELECT id, status, payment_status FROM orders WHERE id=? FOR UPDATE', [orderId]);
    const order = rows[0]; if (!order) throw new Error('Order not found.');

    assertValidOrderStatusTransition(order.status, status);

    if (status === 'CONFIRMED' && order.payment_status !== 'PAID') {
      throw new Error('Only paid orders can be confirmed.');
    }
    if (status === 'CANCELLED' && order.payment_status === 'PAID') {
      throw new Error('Paid orders require refund handling before cancellation.');
    }
    if (status === 'REFUNDED' && order.payment_status !== 'PAID') {
      throw new Error('Only paid orders can be refunded.');
    }

    if (status === 'CANCELLED') {
      const [items] = await connection.execute(
        'SELECT variant_id, quantity FROM order_items WHERE order_id=?',
        [orderId],
      );
      for (const item of items) {
        await releaseStock(connection, item.variant_id, Number(item.quantity));
      }
    }

    await connection.execute('UPDATE orders SET status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', [status, orderId]);
    await connection.execute(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
       VALUES (?, ?, 'ORDER', ?, ?)`,
      [actor.id, 'ORDER_STATUS_CHANGED', orderId, JSON.stringify({ from: order.status, to: status })],
    );
    return { id: Number(orderId), status };
  });
}
