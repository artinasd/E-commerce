import { getCurrentUser } from '../../../../lib/auth/session.js';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ success: false, error: 'Authentication required.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    }

    return Response.json({ success: true, data: { user } }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Current-user resolution error:', error);
    return Response.json({ success: false, error: 'Unable to resolve the current session.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
