import { NextResponse } from 'next/server';
import { register } from '../../../../server/auth/service.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await register(body);

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    if (error?.code === 'IDENTITY_EXISTS') {
      return NextResponse.json({ success: false, error: error.message }, { status: 409 });
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ success: false, error: 'Invalid JSON request body.' }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: error.message || 'Unable to create account.' }, { status: 400 });
  }
}
