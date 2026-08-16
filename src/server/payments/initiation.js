import { findOrderByIdForUser } from '../db/repositories/orders.js';
import { createPayment, getActivePaymentForOrder, updatePaymentResult } from '../db/repositories/payments.js';
import { getPaymentProvider } from './providers/index.js';

export async function initiateOrderPayment({ userId, orderId, callbackUrl }) {
  const order = await findOrderByIdForUser(orderId, userId);
  if (!order) {
    const error = new Error('Order not found.');
    error.statusCode = 404;
    throw error;
  }

  if (order.status !== 'PENDING' || order.payment_status !== 'UNPAID') {
    const error = new Error('This order is not available for payment.');
    error.statusCode = 409;
    throw error;
  }

  const existingPayment = await getActivePaymentForOrder(order.id);
  if (existingPayment) {
    const error = new Error('A payment attempt is already active for this order.');
    error.statusCode = 409;
    throw error;
  }

  const providerName = process.env.PAYMENT_PROVIDER;
  if (!providerName) {
    const error = new Error('Payment provider is not configured.');
    error.statusCode = 503;
    throw error;
  }

  const provider = getPaymentProvider();
  const result = await provider.createPayment({
    orderId: order.id,
    orderNumber: order.order_number,
    amount: Number(order.total_amount),
    callbackUrl,
  });

  if (!result?.redirectUrl || !result?.providerReference) {
    throw new Error('Payment provider returned an incomplete payment response.');
  }

  const payment = await createPayment({
    orderId: order.id,
    provider: providerName,
    amount: Number(order.total_amount),
  });

  await updatePaymentResult({
    paymentId: payment.id,
    status: 'PENDING',
    providerReference: result.providerReference,
  });

  return { paymentId: payment.id, redirectUrl: result.redirectUrl };
}
