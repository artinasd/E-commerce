import { requireRole } from '../../../../lib/auth/session.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';
import { listReviewsForModeration } from '../../../../server/admin/reviews.js';

export async function GET(request) {
  try {
    await requireRole(['ADMIN', 'SUPER_ADMIN']);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';
    const limit = searchParams.get('limit') || 50;
    const offset = searchParams.get('offset') || 0;
    const reviews = await listReviewsForModeration({ status, limit, offset });
    return apiSuccess({ reviews });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load review moderation queue.');
  }
}
