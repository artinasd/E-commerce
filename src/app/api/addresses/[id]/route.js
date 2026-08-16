import { requireUser } from '../../../../lib/auth/session.js';
import { deleteUserAddress, getUserAddress, updateUserAddress } from '../../../../server/address/service.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';

export async function GET(_request, { params }) {
  try {
    const user = await requireUser();
    const address = await getUserAddress(user.id, params.id);
    if (!address) return apiSuccess({ error: { code: 'ADDRESS_NOT_FOUND', message: 'Address not found.' } }, 404);
    return apiSuccess({ address });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load address.');
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await requireUser();
    const payload = await request.json();
    return apiSuccess({ address: await updateUserAddress(user.id, params.id, payload) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to update address.');
  }
}

export async function DELETE(_request, { params }) {
  try {
    const user = await requireUser();
    return apiSuccess(await deleteUserAddress(user.id, params.id));
  } catch (error) {
    return apiErrorResponse(error, 'Unable to delete address.');
  }
}
