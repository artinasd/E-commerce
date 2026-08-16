import { requireUser } from '../../../../../lib/auth/session.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';
import { getProductBySlug } from '../../../../../server/catalog/service.js';
import { getProductReviews, submitProductReview } from '../../../../../server/reviews/service.js';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return apiSuccess({ product: null }, 404);
    const url = new URL(request.url);
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 20, 1), 100);
    const offset = Math.max(Number(url.searchParams.get('offset')) || 0, 0);
    return apiSuccess({ productId: product.id, ...(await getProductReviews(product.id, { limit, offset })) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load product reviews.');
  }
}

export async function POST(request, { params }) {
  try {
    const user = await requireUser();
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return apiSuccess({ product: null }, 404);
    const body = await request.json();
    return apiSuccess(await submitProductReview(user.id, product.id, body), 201);
  } catch (error) {
    return apiErrorResponse(error, 'Unable to submit review.');
  }
}
