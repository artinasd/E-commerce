import { getProductBySlug } from '../../../../server/catalog/service.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return apiSuccess({ product: null }, 404);
    }

    return apiSuccess({ product });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load the product.');
  }
}
