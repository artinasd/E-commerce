import { logout } from '../../../../server/auth/service.js';

export async function POST() {
  try {
    await logout();
    return Response.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ success: false, error: 'Unable to sign out.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
