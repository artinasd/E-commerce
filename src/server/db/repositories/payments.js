import { query, withTransaction } from '../connection.js';

export async function createPayment({ orderId, provider, amount, status = 'PENDING' }) {
  const result = await query(`INSERT INTO payments (order_id, provider, amount, status) VALUES (?, ?, ?, ?)`, [orderId, provider, amount, status]);
  const rows = await query(`SELECT * FROM payments WHERE id = ? LIMIT 1`, [result.insertId]);
  return rows[0] || null;
}

export async function getPaymentById(id) {
  const rows = await query(`SELECT * FROM payments WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

export async function getPaymentByProviderReference(provider, providerReference) {
  const rows = await query(`SELECT * FROM payments WHERE provider = ? AND provider_reference = ? LIMIT 1`, [provider, providerReference]);
  return rows[0] || null;
}

export async function getActivePaymentForOrder(orderId) {
  const rows = await query(`SELECT * FROM payments WHERE order_id = ? AND status = 'PENDING' ORDER BY id DESC LIMIT 1`, [orderId]);
  return rows[0] || null;
}

export async function updatePaymentResult({ paymentId, status, providerReference = null, paidAt = null }) {
  await query(`UPDATE payments SET status = ?, provider_reference = COALESCE(?, provider_reference), paid_at = COALESCE(?, paid_at), updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [status, providerReference, paidAt, paymentId]);
  return getPaymentById(paymentId);
}

export async function markOrderPaidAtomically({ paymentId, orderId, providerReference, paidAt }) {
  return withTransaction(async (connection) => {
    const [paymentRows] = await connection.execute(`SELECT * FROM payments WHERE id = ? FOR UPDATE`, [paymentId]);
    const payment = paymentRows[0];
    if (!payment || String(payment.order_id) !== String(orderId)) throw new Error('Payment/order mismatch.');
    if (payment.status === 'PAID') return { payment, alreadyProcessed: true };
    if (payment.status !== 'PENDING') throw new Error('Payment is not pending.');

    const [orderRows] = await connection.execute(`SELECT id, status, payment_status, reservation_expires_at FROM orders WHERE id = ? FOR UPDATE`, [orderId]);
    const order = orderRows[0];
    if (!order || order.payment_status !== 'UNPAID' || order.status !== 'PENDING') throw new Error('Order is not eligible for payment settlement.');
    if (order.reservation_expires_at && new Date(order.reservation_expires_at).getTime() <= Date.now()) throw new Error('The order reservation has expired.');

    const [items] = await connection.execute(`SELECT variant_id, quantity FROM order_items WHERE order_id = ? AND variant_id IS NOT NULL FOR UPDATE`, [orderId]);
    for (const item of items) {
      const [inventoryResult] = await connection.execute(
        `UPDATE inventory SET quantity = quantity - ?, reserved_quantity = reserved_quantity - ? WHERE variant_id = ? AND quantity >= ? AND reserved_quantity >= ?`,
        [item.quantity, item.quantity, item.variant_id, item.quantity, item.quantity],
      );
      if (inventoryResult.affectedRows !== 1) throw new Error('Inventory could not be finalized for the order.');
    }

    await connection.execute(`UPDATE payments SET status = 'PAID', provider_reference = COALESCE(?, provider_reference), paid_at = COALESCE(?, CURRENT_TIMESTAMP), updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [providerReference, paidAt, paymentId]);
    await connection.execute(`UPDATE orders SET payment_status = 'PAID', status = 'CONFIRMED', reservation_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [orderId]);

    const [updatedRows] = await connection.execute(`SELECT * FROM payments WHERE id = ? LIMIT 1`, [paymentId]);
    return { payment: updatedRows[0] || null, alreadyProcessed: false };
  });
}

export async function expireOrderPayment(paymentId) {
  return withTransaction(async (connection) => {
    const [paymentRows] = await connection.execute(`SELECT * FROM payments WHERE id = ? FOR UPDATE`, [paymentId]);
    const payment = paymentRows[0];
    if (!payment || payment.status !== 'PENDING') return { expired: false };

    const [orderRows] = await connection.execute(`SELECT id, status, payment_status, reservation_expires_at FROM orders WHERE id = ? FOR UPDATE`, [payment.order_id]);
    const order = orderRows[0];
    if (!order || order.status !== 'PENDING' || order.payment_status !== 'UNPAID') return { expired: false };
    if (!order.reservation_expires_at || new Date(order.reservation_expires_at).getTime() > Date.now()) return { expired: false };

    const [items] = await connection.execute(`SELECT variant_id, quantity FROM order_items WHERE order_id = ? AND variant_id IS NOT NULL FOR UPDATE`, [order.id]);
    for (const item of items) {
      const [inventoryResult] = await connection.execute(`UPDATE inventory SET reserved_quantity = reserved_quantity - ? WHERE variant_id = ? AND reserved_quantity >= ?`, [item.quantity, item.variant_id, item.quantity]);
      if (inventoryResult.affectedRows !== 1) throw new Error('Inventory reservation could not be released.');
    }

    await connection.execute(`UPDATE payments SET status = 'EXPIRED', updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [payment.id]);
    await connection.execute(`UPDATE orders SET payment_status = 'FAILED', status = 'CANCELLED', reservation_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [order.id]);
    return { expired: true };
  });
}
