import { updateVariant } from '../../../../../../../server/admin/variants.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../../server/api/response.js';

export async function PATCH(request, { params }) {
  try {
    const { variantId } = await params;
    const id = Number(variantId);
    if (!Number.isSafeInteger(id) || id <= 0) return apiErrorResponse(new Error('Invalid variant id.'), 'Unable to update variant.');
    const body = await request.json();
    return apiSuccess({ variant: await updateVariant(id, body) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to update variant.');
  }
}
