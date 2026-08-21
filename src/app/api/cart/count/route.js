import { requireUser } from '../../../../lib/auth/session.js';
import { getCart } from '../../../../server/cart/service.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';

export async function GET() {
  try {
    const user = await requireUser();
    const cart = await getCart(user.id);
    return apiSuccess({ itemCount: cart.itemCount });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load cart count.');
  }
}
