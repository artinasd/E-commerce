import { adjustInventory } from '../../../../../server/admin/inventory.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const result = await adjustInventory({ variantId: Number(params.variantId), delta: Number(body.delta), reason: body.reason ?? null });
    return apiSuccess({ inventory: result });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to adjust inventory.');
  }
}
