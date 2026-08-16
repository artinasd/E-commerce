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

    await connection.execute(`UPDATE payments SET status = 'PAID', provider_reference = COALESCE(?, provider_reference), paid_at = COALESCE(?, CURRENT_TIMESTAMP), updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [providerReference, paidAt, paymentId]);
    await connection.execute(`UPDATE orders SET payment_status = 'PAID', status = CASE WHEN status = 'PENDING' THEN 'CONFIRMED' ELSE status END, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND payment_status <> 'PAID'`, [orderId]);

    const [updatedRows] = await connection.execute(`SELECT * FROM payments WHERE id = ? LIMIT 1`, [paymentId]);
    return { payment: updatedRows[0] || null, alreadyProcessed: false };
  });
}
