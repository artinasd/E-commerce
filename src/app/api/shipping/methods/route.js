import { requireUser } from '../../../../lib/auth/session.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';
import { listActiveShippingMethods } from '../../../../server/shipping/service.js';

export async function GET(request) {
  try {
    await requireUser();
    const province = new URL(request.url).searchParams.get('province')?.trim() || null;
    return apiSuccess({ methods: await listActiveShippingMethods(province) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load shipping methods.');
  }
}
