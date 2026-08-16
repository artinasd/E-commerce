import { requireUser } from '../../../lib/auth/session.js';
import { apiErrorResponse, apiSuccess } from '../../../server/api/response.js';
import { validateOrderId } from '../../../server/orders/validation.js';
import { initiateOrderPayment } from '../../../server/payments/initiation.js';

export async function POST(request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const orderId = validateOrderId(body?.orderId);
    const baseUrl = process.env.APP_URL;
    if (!baseUrl) {
      const error = new Error('Application URL is not configured.');
      error.statusCode = 503;
      throw error;
    }

    const callbackUrl = new URL('/api/payments/callback', baseUrl).toString();
    const result = await initiateOrderPayment({ userId: user.id, orderId, callbackUrl });
    return apiSuccess(result, 201);
  } catch (error) {
    return apiErrorResponse(error, 'Unable to initiate payment.');
  }
}
