import { checkoutFromCart } from '../../../src/server/checkout/service.js';
import { requireUser } from '../../../src/lib/auth/session.js';
import { errorResponse, jsonResponse } from '../../../src/server/http/response.js';

export async function POST(request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const result = await checkoutFromCart(user.id, body ?? {});
    return jsonResponse(result, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
