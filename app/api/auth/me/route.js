import { getCurrentUser } from '../../../../../src/lib/auth/session.js';
import { errorResponse, jsonResponse } from '../../../../../src/server/http/response.js';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      const error = new Error('Authentication required.');
      error.code = 'UNAUTHENTICATED';
      return errorResponse(error);
    }
    return jsonResponse({ user });
  } catch (error) {
    return errorResponse(error);
  }
}
