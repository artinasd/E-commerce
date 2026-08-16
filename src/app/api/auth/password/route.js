import { changePassword } from '../../../../server/auth/service.js';
import { requireUser } from '../../../../lib/auth/session.js';
import { validatePasswordChangeInput } from '../../../../server/auth/validation.js';

function json(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const validation = validatePasswordChangeInput(body);

    if (!validation.valid) return json({ success: false, errors: validation.errors }, 400);

    await changePassword(user.id, validation.data.currentPassword, validation.data.newPassword);
    return json({ success: true, data: { message: 'Password changed successfully.' } });
  } catch (error) {
    if (error?.code === 'UNAUTHENTICATED') return json({ success: false, error: 'Authentication required.' }, 401);
    if (error?.code === 'INVALID_CURRENT_PASSWORD') return json({ success: false, error: 'Current password is incorrect.' }, 400);
    if (error instanceof SyntaxError) return json({ success: false, error: 'Invalid JSON request body.' }, 400);

    console.error('Password change error:', error);
    return json({ success: false, error: 'Unable to change password.' }, 500);
  }
}
