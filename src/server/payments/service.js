import { getPaymentProvider } from './providers/index.js';

export async function initiatePayment({ order, callbackUrl }) {
  if (!order?.id || !order?.total_amount) {
    throw new Error('A valid order is required to initiate payment.');
  }
  const provider = getPaymentProvider();
  return provider.createPayment({
    orderId: order.id,
    orderNumber: order.order_number,
    amount: Number(order.total_amount),
    callbackUrl,
  });
}

export async function verifyPayment({ payment, callback }) {
  if (!payment?.id || !callback) throw new Error('Payment verification data is incomplete.');
  const provider = getPaymentProvider();
  return provider.verifyPayment({ payment, callback });
}
