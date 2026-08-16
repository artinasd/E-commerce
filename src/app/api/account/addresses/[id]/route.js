import { requireUser } from '../../../../../lib/auth/session.js';
import { deleteAddress } from '../../../../../server/account/service.js';
import { validateAddressId } from '../../../../../server/account/validation.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/errors.js';

export async function DELETE(_request, { params }) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const addressId = validateAddressId(id);
    const deleted = await deleteAddress(user.id, addressId);
    if (!deleted) return apiSuccess({ address: null }, 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to delete the address.');
  }
}
