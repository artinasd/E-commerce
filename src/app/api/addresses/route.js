import { requireUser } from '../../../lib/auth/session.js';
import { addUserAddress, getUserAddresses } from '../../../server/address/service.js';
import { apiErrorResponse, apiSuccess } from '../../../server/api/response.js';

export async function GET() {
  try {
    const user = await requireUser();
    return apiSuccess({ addresses: await getUserAddresses(user.id) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load addresses.');
  }
}

export async function POST(request) {
  try {
    const user = await requireUser();
    const payload = await request.json();
    return apiSuccess({ address: await addUserAddress(user.id, payload) }, 201);
  } catch (error) {
    return apiErrorResponse(error, 'Unable to create address.');
  }
}
