import { NextResponse } from 'next/server';
import { login } from '../../../../server/auth/service.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await login(body);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (error?.code === 'INVALID_CREDENTIALS') {
      return NextResponse.json({ success: false, error: 'Invalid credentials.' }, { status: 401 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ success: false, error: 'Invalid JSON request body.' }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: error.message || 'Unable to sign in.' }, { status: 400 });
  }
}
