import { NextResponse } from 'next/server';
import { logout } from '../../../../server/auth/service.js';

export async function POST() {
  try {
    await logout();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Unable to sign out.' }, { status: 500 });
  }
}
