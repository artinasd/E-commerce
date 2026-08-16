import { getPaymentById, markOrderPaidAtomically } from '../db/repositories/payments.js';
import { verifyPayment } from './service.js';

export async function handlePaymentCallback(searchParams) {
  const paymentId = Number(searchParams.get('paymentId'));
  if (!Number.isSafeInteger(paymentId) || paymentId < 1) throw new Error('Invalid payment id.');

  const callback = Object.fromEntries(searchParams.entries());
  const payment = await getPaymentById(paymentId);
  if (!payment) {
    const error = new Error('Payment not found.');
    error.statusCode = 404;
    throw error;
  }

  if (payment.status === 'PAID') return { payment, alreadyProcessed: true };
  if (payment.status !== 'PENDING') throw new Error('Payment is not eligible for verification.');

  const result = await verifyPayment({ payment, callback });
  if (!result?.verified) throw new Error('Payment verification failed.');
  if (Number(result.amount) !== Number(payment.amount)) throw new Error('Verified payment amount does not match the order amount.');

  const providerReference = String(result.providerReference || payment.provider_reference || '').trim();
  if (!providerReference) throw new Error('Verified payment reference is missing.');

  return markOrderPaidAtomically({ paymentId: payment.id, orderId: payment.order_id, providerReference, paidAt: result.paidAt || new Date() });
}
