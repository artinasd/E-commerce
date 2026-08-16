import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth/session.js';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });
    }

    return NextResponse.json({ success: true, data: { user } });
  } catch {
    return NextResponse.json({ success: false, error: 'Unable to resolve the current session.' }, { status: 500 });
  }
}
