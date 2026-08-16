import { requireUser } from '../../../../../lib/auth/session.js';
import { removeItem, updateItem } from '../../../../../server/cart/service.js';
import { validateCartItemId, validateQuantity } from '../../../../../server/cart/validation.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function PATCH(request, { params }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const itemId = validateCartItemId(id);
    const body = await request.json();
    const quantity = validateQuantity(body.quantity);
    return apiSuccess({ cart: await updateItem(user.id, itemId, quantity) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to update the cart item.');
  }
}

export async function DELETE(_request, { params }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const itemId = validateCartItemId(id);
    return apiSuccess({ cart: await removeItem(user.id, itemId) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to remove the cart item.');
  }
}
