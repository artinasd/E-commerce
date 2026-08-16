import { completeMockPayment } from '../../../../server/payments/mock.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const paymentId = Number(body?.paymentId);
    if (!Number.isSafeInteger(paymentId) || paymentId < 1) throw new Error('Invalid payment.');
    return apiSuccess({ payment: await completeMockPayment(paymentId, body?.success === true) });
  } catch (error) { return apiErrorResponse(error, 'Unable to process mock payment.'); }
}
