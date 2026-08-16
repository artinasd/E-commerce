import { requireRole } from '../../../../../../lib/auth/session.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../server/api/response.js';
import { findReviewForModeration, setReviewModerationStatus } from '../../../../../../server/admin/reviews.js';

const ALLOWED_STATUSES = new Set(['APPROVED', 'REJECTED']);

export async function PATCH(request, { params }) {
  try {
    await requireRole(['ADMIN', 'SUPER_ADMIN']);
    const reviewId = Number(params.id);
    if (!Number.isSafeInteger(reviewId) || reviewId < 1) {
      return apiSuccess({ error: { code: 'INVALID_REVIEW_ID', message: 'Invalid review id.' } }, 400);
    }

    const body = await request.json();
    const status = typeof body?.status === 'string' ? body.status.toUpperCase() : '';
    if (!ALLOWED_STATUSES.has(status)) {
      return apiSuccess({ error: { code: 'INVALID_REVIEW_STATUS', message: 'Status must be APPROVED or REJECTED.' } }, 400);
    }

    const review = await findReviewForModeration(reviewId);
    if (!review) {
      return apiSuccess({ error: { code: 'REVIEW_NOT_FOUND', message: 'Review not found.' } }, 404);
    }

    await setReviewModerationStatus(reviewId, status);
    return apiSuccess({ review: { id: reviewId, status } });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to moderate review.');
  }
}
