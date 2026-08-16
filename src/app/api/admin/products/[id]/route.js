import { setProductActive } from '../../../../../server/admin/products.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    return apiSuccess({ product: await setProductActive(Number(params.id), Boolean(body.isActive)) });
  } catch (error) { return apiErrorResponse(error, 'Unable to update product.'); }
}
