import { deleteAdminProduct, updateAdminProduct } from '../../../../../server/admin/products.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    return apiSuccess({ product: await updateAdminProduct(Number(params.id), body) });
  } catch (error) { return apiErrorResponse(error, 'Unable to update product.'); }
}

export async function DELETE(_request, { params }) {
  try {
    return apiSuccess({ product: await deleteAdminProduct(Number(params.id)) });
  } catch (error) { return apiErrorResponse(error, 'Unable to delete product.'); }
}
