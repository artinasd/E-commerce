import { getCategoryBySlug } from '../../../../server/catalog/service.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);
    if (!category) return apiSuccess({ category: null }, 404);
    return apiSuccess({ category });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load the category.');
  }
}
