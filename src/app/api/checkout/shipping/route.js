import { requireUser } from '../../../../lib/auth/session.js';
import { query } from '../../../../server/db/connection.js';
import { listAvailableShippingMethods } from '../../../../server/pricing/shipping.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';

const readConnection = {
  execute: async (sql, params) => [await query(sql, params)],
};

export async function GET(request) {
  try {
    await requireUser();
    const province = new URL(request.url).searchParams.get('province')?.trim() || '';
    if (!province) return apiErrorResponse(new Error('Delivery province is required.'), 'Unable to load shipping methods.');
    const methods = await listAvailableShippingMethods(readConnection, province);
    return apiSuccess({ methods });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load shipping methods.');
  }
}
