import { updateProductImage } from '../../../../../../../server/admin/images.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../../server/api/response.js';

export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    return apiSuccess({ image: await updateProductImage(Number(params.imageId), body) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to update product image.');
  }
}
