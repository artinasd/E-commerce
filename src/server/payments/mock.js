import crypto from 'node:crypto';
import { withTransaction } from '../db/connection.js';
import { requireUser } from '../../lib/auth/session.js';
import { consumeReservedStock, releaseStock } from '../inventory/service.js';

const provider = 'MOCK';

async function getOwnedOrder(connection, orderId, userId, lock = true) {
  const [rows] = await connection.execute(`SELECT id,order_number,user_id,status,payment_status,total_amount,reservation_expires_at FROM orders WHERE id=? AND user_id=? ${lock ? 'FOR UPDATE' : ''}`, [orderId, userId]);
  return rows[0];
}

export async function startMockPayment(orderId) {
  const user = await requireUser();
  return withTransaction(async (connection) => {
    const order = await getOwnedOrder(connection, orderId, user.id);
    if (!order) throw new Error('Order not found.');
    if (order.status !== 'PENDING' || order.payment_status !== 'UNPAID') throw new Error('This order is not available for payment.');
    if (order.reservation_expires_at && new Date(order.reservation_expires_at) <= new Date()) throw new Error('The order reservation has expired. Please create a new order.');
    const [existing] = await connection.execute(`SELECT id,provider_reference,status FROM payments WHERE order_id=? AND provider=? ORDER BY id DESC LIMIT 1`, [orderId, provider]);
    if (existing[0]?.status === 'PENDING') return { paymentId: existing[0].id, redirectUrl: `/payment/mock?paymentId=${existing[0].id}` };
    const reference = `MOCK-${crypto.randomUUID()}`;
    const [result] = await connection.execute(`INSERT INTO payments (order_id,provider,provider_reference,amount,status) VALUES (?,?,?,?, 'PENDING')`, [orderId, provider, reference, order.total_amount]);
    return { paymentId: result.insertId, providerReference: reference, redirectUrl: `/payment/mock?paymentId=${result.insertId}` };
  });
}

export async function completeMockPayment(paymentId, success) {
  const user = await requireUser();
  return withTransaction(async (connection) => {
    const [payments] = await connection.execute(`SELECT p.*,o.user_id,o.order_number,o.status order_status,o.payment_status order_payment_status,o.reservation_expires_at FROM payments p INNER JOIN orders o ON o.id=p.order_id WHERE p.id=? AND p.provider=? FOR UPDATE`, [paymentId, provider]);
    const payment = payments[0];
    if (!payment || Number(payment.user_id) !== Number(user.id)) throw new Error('Payment not found.');
    if (payment.status === 'SUCCESS') return { orderId: payment.order_id, orderNumber: payment.order_number, status: 'PAID', alreadyProcessed: true };
    if (payment.status !== 'PENDING') throw new Error('This payment can no longer be processed.');
    if (payment.order_status !== 'PENDING' || payment.order_payment_status !== 'UNPAID') throw new Error('This order is no longer available for payment.');
    const [items] = await connection.execute(`SELECT variant_id,quantity FROM order_items WHERE order_id=?`, [payment.order_id]);
    if (!success) {
      await connection.execute(`UPDATE payments SET status='FAILED' WHERE id=?`, [paymentId]);
      await connection.execute(`UPDATE orders SET payment_status='FAILED' WHERE id=? AND status='PENDING'`, [payment.order_id]);
      for (const item of items) await releaseStock(connection, item.variant_id, Number(item.quantity));
      return { orderId: payment.order_id, orderNumber: payment.order_number, status: 'FAILED' };
    }
    if (payment.reservation_expires_at && new Date(payment.reservation_expires_at) <= new Date()) {
      await connection.execute(`UPDATE payments SET status='FAILED' WHERE id=?`, [paymentId]);
      await connection.execute(`UPDATE orders SET payment_status='FAILED' WHERE id=? AND status='PENDING'`, [payment.order_id]);
      for (const item of items) await releaseStock(connection, item.variant_id, Number(item.quantity));
      throw new Error('The order reservation has expired.');
    }
    for (const item of items) await consumeReservedStock(connection, item.variant_id, Number(item.quantity));
    await connection.execute(`UPDATE payments SET status='SUCCESS',paid_at=CURRENT_TIMESTAMP WHERE id=? AND status='PENDING'`, [paymentId]);
    await connection.execute(`UPDATE orders SET payment_status='PAID',status='CONFIRMED' WHERE id=? AND status='PENDING' AND payment_status='UNPAID'`, [payment.order_id]);
    return { orderId: payment.order_id, orderNumber: payment.order_number, status: 'PAID' };
  });
}
