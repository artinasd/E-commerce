import { login } from '../../../../../src/server/auth/service.js';
import { errorResponse, jsonResponse } from '../../../../../src/server/http/response.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await login({
      email: body?.email,
      phone: body?.phone,
      password: body?.password,
    });
    return jsonResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}
