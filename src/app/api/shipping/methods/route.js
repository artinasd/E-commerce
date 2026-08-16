import { requireUser } from '../../../../../lib/auth/session.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';
import { listActiveShippingMethods } from '../../../../../server/shipping/service.js';

export async function GET() {
  try {
    await requireUser();
    return apiSuccess({ methods: await listActiveShippingMethods() });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load shipping methods.');
  }
}
