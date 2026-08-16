import { logout } from '../../../../../src/server/auth/service.js';
import { errorResponse, jsonResponse } from '../../../../../src/server/http/response.js';

export async function POST() {
  try {
    await logout();
    return jsonResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
