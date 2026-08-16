import { setProductStatus } from '../../../../../server/admin/products.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    return apiSuccess({ product: await setProductStatus(Number(params.id), body.status) });
  } catch (error) { return apiErrorResponse(error, 'Unable to update product.'); }
}
