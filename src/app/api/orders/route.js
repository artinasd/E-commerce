import { requireUser } from '../../../lib/auth/session.js';
import { apiErrorResponse, apiSuccess } from '../../../server/api/response.js';
import { checkoutFromCart } from '../../../server/checkout/service.js';
import { listUserOrders } from '../../../server/orders/service.js';
import { parseOrderQuery } from '../../../server/orders/validation.js';

export async function GET(request) {
  try {
    const user = await requireUser();
    const params = parseOrderQuery(new URL(request.url).searchParams);
    return apiSuccess(await listUserOrders(user.id, params));
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load orders.');
  }
}

export async function POST(request) {
  try {
    const user = await requireUser();
    const payload = await request.json();
    return apiSuccess({ order: await checkoutFromCart(user.id, payload) }, 201);
  } catch (error) {
    return apiErrorResponse(error, 'Unable to create the order.');
  }
}
