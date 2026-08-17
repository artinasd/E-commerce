import { deleteProductImage } from '../../../../../server/admin/images.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function DELETE(_request, { params }) {
  try { return apiSuccess({ image: await deleteProductImage(Number(params.id)) }); }
  catch (error) { return apiErrorResponse(error, 'Unable to delete product image.'); }
}
