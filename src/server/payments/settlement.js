import { withTransaction } from '../db/connection.js';
import { consumeReservedStock } from '../inventory/service.js';

export async function settlePayment({ paymentId, providerReference = null, verifiedAmount }) {
  return withTransaction(async (connection) => {
    const [payments] = await connection.execute(
      `SELECT p.id, p.order_id, p.status, p.amount, o.status AS order_status, o.total_amount
         FROM payments p
         INNER JOIN orders o ON o.id = p.order_id
        WHERE p.id = ?
        FOR UPDATE`,
      [paymentId],
    );
    const payment = payments[0];
    if (!payment) {
      const error = new Error('Payment not found.');
      error.code = 'PAYMENT_NOT_FOUND';
      throw error;
    }

    if (payment.status === 'PAID') {
      return { alreadySettled: true, orderId: payment.order_id };
    }

    if (Number(payment.amount) !== Number(verifiedAmount) || Number(payment.total_amount) !== Number(verifiedAmount)) {
      const error = new Error('Verified payment amount does not match the order total.');
      error.code = 'PAYMENT_AMOUNT_MISMATCH';
      throw error;
    }

    const [items] = await connection.execute(
      `SELECT variant_id, quantity
         FROM order_items
        WHERE order_id = ?`,
      [payment.order_id],
    );

    for (const item of items) {
      await consumeReservedStock(connection, item.variant_id, Number(item.quantity));
    }

    await connection.execute(
      `UPDATE payments
          SET status = 'PAID',
              provider_reference = COALESCE(?, provider_reference),
              paid_at = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND status <> 'PAID'`,
      [providerReference, paymentId],
    );

    await connection.execute(
      `UPDATE orders
          SET payment_status = 'PAID',
              status = 'CONFIRMED',
              updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND status = 'PENDING' AND payment_status = 'UNPAID'`,
      [payment.order_id],
    );

    await connection.execute(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
       SELECT user_id, 'PAYMENT_SETTLED', 'ORDER', id, ?
         FROM orders WHERE id = ?`,
      [JSON.stringify({ paymentId, providerReference }), payment.order_id],
    );

    return { alreadySettled: false, paymentId, orderId: payment.order_id };
  });
}
