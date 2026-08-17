import { updateProductImage, deleteProductImage } from '../../../../../server/admin/images.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    return apiSuccess({ image: await updateProductImage(Number(id), body) });
  } catch (error) { return apiErrorResponse(error, 'Unable to update product image.'); }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    return apiSuccess({ image: await deleteProductImage(Number(id)) });
  } catch (error) { return apiErrorResponse(error, 'Unable to delete product image.'); }
}
