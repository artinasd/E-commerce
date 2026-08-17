import { deleteAdminProduct, updateAdminProduct } from '../../../../../server/admin/products.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const productId = Number(id);
    if (!Number.isInteger(productId) || productId <= 0) throw new Error('Invalid product id.');
    const body = await request.json();
    return apiSuccess({ product: await updateAdminProduct(productId, body) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to update product.');
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const productId = Number(id);
    if (!Number.isInteger(productId) || productId <= 0) throw new Error('Invalid product id.');
    return apiSuccess({ product: await deleteAdminProduct(productId) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to delete product.');
  }
}
