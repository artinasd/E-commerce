import { getBrandBySlug } from '../../../../server/catalog/service.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const brand = await getBrandBySlug(slug);
    if (!brand) return apiSuccess({ brand: null }, 404);
    return apiSuccess({ brand });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load the brand.');
  }
}
