import { requireUser } from '../../../../lib/auth/session.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';
import { initiatePayment, verifyPayment } from '../../../../server/payments/service.js';

export async function POST(request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const paymentId = Number(body.paymentId);
    if (!Number.isInteger(paymentId) || paymentId <= 0) {
      return apiSuccess({ error: { code: 'INVALID_PAYMENT_ID', message: 'A valid payment ID is required.' } }, 400);
    }

    const result = await verifyPayment({
      paymentId,
      userId: user.id,
      authority: typeof body.authority === 'string' ? body.authority : null,
    });

    return apiSuccess({ payment: result });
  } catch (error) {
    return apiErrorResponse(error, 'Payment verification failed.');
  }
}
