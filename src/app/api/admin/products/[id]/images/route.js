import { addProductImage } from '../../../../../../server/admin/images.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../server/api/response.js';

export async function POST(request, { params }) {
  try { const body = await request.json(); return apiSuccess({ image: await addProductImage({ productId: Number(params.id), ...body }) }, 201); }
  catch (error) { return apiErrorResponse(error, 'Unable to add product image.'); }
}
