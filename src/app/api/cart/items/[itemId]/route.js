import { requireUser } from '../../../../../lib/auth/session.js';
import { updateItem, removeItem } from '../../../../../server/cart/service.js';
import { validateCartItemId, validateQuantity } from '../../../../../server/cart/validation.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function PATCH(request, { params }) {
  try {
    const user = await requireUser();
    const { itemId } = await params;
    const body = await request.json();
    const id = validateCartItemId(itemId);
    const quantity = validateQuantity(body.quantity);
    return apiSuccess({ cart: await updateItem(user.id, id, quantity) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to update the cart item.');
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireUser();
    const { itemId } = await params;
    const id = validateCartItemId(itemId);
    return apiSuccess({ cart: await removeItem(user.id, id) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to remove the cart item.');
  }
}
