import { login } from '../../../../server/auth/service.js';
import { validateLoginInput } from '../../../../server/auth/validation.js';
import { checkAuthRateLimit, resetAuthRateLimit } from '../../../../server/auth/rate-limit.js';

function json(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = validateLoginInput(body);
    if (!validation.valid) return json({ success: false, errors: validation.errors }, 400);

    const identityKey = validation.data.email || validation.data.phone;
    const limit = checkAuthRateLimit(`login:${identityKey}`);
    if (!limit.allowed) return json({ success: false, error: 'Too many login attempts. Please try again later.' }, 429);

    const result = await login(validation.data);
    resetAuthRateLimit(`login:${identityKey}`);
    return json({ success: true, data: result });
  } catch (error) {
    if (error?.code === 'INVALID_CREDENTIALS') return json({ success: false, error: 'Invalid credentials.' }, 401);
    if (error instanceof SyntaxError) return json({ success: false, error: 'Invalid JSON request body.' }, 400);

    console.error('Login error:', error);
    return json({ success: false, error: 'Unable to sign in.' }, 500);
  }
}
