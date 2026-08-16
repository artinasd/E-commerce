import { requireUser } from '../../../../lib/auth/session.js';
import { addItem } from '../../../../server/cart/service.js';
import { validateQuantity, validateVariantId } from '../../../../server/cart/validation.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';

export async function POST(request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const variantId = validateVariantId(body.variantId);
    const quantity = validateQuantity(body.quantity);
    return apiSuccess({ cart: await addItem(user.id, variantId, quantity) }, 201);
  } catch (error) {
    return apiErrorResponse(error, 'Unable to add the item to your cart.');
  }
}
