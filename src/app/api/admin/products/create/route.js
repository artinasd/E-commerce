import { createAdminProduct } from '../../../../../server/admin/products.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function POST(request) {
  try {
    return apiSuccess({ product: await createAdminProduct(await request.json()) }, 201);
  } catch (error) { return apiErrorResponse(error, 'Unable to create product.'); }
}
