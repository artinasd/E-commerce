import { requireUser } from '../../../../lib/auth/session.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';
import { getUserOrder } from '../../../../server/orders/service.js';
import { validateOrderId } from '../../../../server/orders/validation.js';

export async function GET(_request, { params }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const orderId = validateOrderId(id);
    const order = await getUserOrder(user.id, orderId);

    if (!order) return apiSuccess({ order: null }, 404);
    return apiSuccess({ order });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load the order.');
  }
}
