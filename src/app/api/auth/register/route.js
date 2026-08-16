import { register } from '../../../../server/auth/service.js';
import { validateRegistrationInput } from '../../../../server/auth/validation.js';
import { checkAuthRateLimit } from '../../../../server/auth/rate-limit.js';

function json(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = validateRegistrationInput(body);
    if (!validation.valid) return json({ success: false, errors: validation.errors }, 400);

    const identityKey = validation.data.email || validation.data.phone;
    const limit = checkAuthRateLimit(`register:${identityKey}`);
    if (!limit.allowed) return json({ success: false, error: 'Too many registration attempts. Please try again later.' }, 429);

    const result = await register(body);
    return json({ success: true, data: result }, 201);
  } catch (error) {
    if (error?.code === 'IDENTITY_EXISTS' || error?.code === 'ER_DUP_ENTRY') {
      return json({ success: false, error: 'An account already exists with these credentials.' }, 409);
    }

    console.error('Registration error:', error);
    return json({ success: false, error: 'Unable to create the account.' }, 500);
  }
}
