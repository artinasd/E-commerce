import { requireUser } from '../../../../lib/auth/session.js';
import { createAddress, listAddresses } from '../../../../server/account/service.js';
import { validateAddressInput } from '../../../../server/account/validation.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';

export async function GET() {
  try {
    const user = await requireUser();
    return apiSuccess({ addresses: await listAddresses(user.id) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load your addresses.');
  }
}

export async function POST(request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const address = validateAddressInput(body);
    const id = await createAddress(user.id, address);
    return apiSuccess({ addressId: id }, 201);
  } catch (error) {
    return apiErrorResponse(error, 'Unable to save your address.');
  }
}
