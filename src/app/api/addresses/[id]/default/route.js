import { requireUser } from '../../../../../lib/auth/session.js';
import { makeUserAddressDefault } from '../../../../../server/address/service.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function POST(_request, { params }) {
  try {
    const user = await requireUser();
    return apiSuccess({ address: await makeUserAddressDefault(user.id, params.id) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to set default address.');
  }
}
