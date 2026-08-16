import { requireUser } from '../../../lib/auth/session.js';
import { checkoutFromCart } from '../../../server/checkout/service.js';
import { apiErrorResponse, apiSuccess } from '../../../server/api/response.js';

export async function POST(request) {
  try {
    const user = await requireUser();
    const payload = await request.json();
    const order = await checkoutFromCart(user.id, payload);
    return apiSuccess({ order }, 201);
  } catch (error) {
    return apiErrorResponse(error, 'Unable to place your order.');
  }
}
