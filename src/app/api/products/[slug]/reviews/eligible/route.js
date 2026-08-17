import { requireUser } from '../../../../../../lib/auth/session.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../server/api/response.js';
import { getProductBySlug } from '../../../../../../server/catalog/service.js';
import { getEligibleReviewItems } from '../../../../../../server/reviews/service.js';

export async function GET(_request, { params }) {
  try {
    const user = await requireUser();
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return apiSuccess({ product: null }, 404);
    return apiSuccess({ items: await getEligibleReviewItems(user.id, product.id) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load review eligibility.');
  }
}
