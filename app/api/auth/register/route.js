import { register } from '../../../../../src/server/auth/service.js';
import { errorResponse, jsonResponse } from '../../../../../src/server/http/response.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await register({
      email: body?.email,
      phone: body?.phone,
      password: body?.password,
      firstName: body?.firstName,
      lastName: body?.lastName,
    });
    return jsonResponse(result, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
