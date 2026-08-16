import { requireRole } from '../../../../../../lib/auth/session.js';
import { updateAdminReviewStatus } from '../../../../../../server/admin/reviews.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../server/api/response.js';

export async function POST(request, { params }) {
  try {
    await requireRole(['ADMIN', 'SUPER_ADMIN']);
    const form = await request.formData();
    const status = form.get('status');
    if (status !== 'APPROVED' && status !== 'REJECTED') {
      return apiSuccess({ error: { code: 'INVALID_STATUS', message: 'Invalid review status.' } }, 400);
    }
    const review = await updateAdminReviewStatus(Number(params.id), status);
    if (!review) return apiSuccess({ error: { code: 'REVIEW_NOT_FOUND', message: 'Review not found.' } }, 404);
    return Response.redirect(new URL('/admin/reviews?status=PENDING', request.url), 303);
  } catch (error) {
    return apiErrorResponse(error, 'Unable to moderate review.');
  }
}
