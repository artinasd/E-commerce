import { NextResponse } from 'next/server';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function proxy(request) {
  if (!MUTATING_METHODS.has(request.method)) return NextResponse.next();

  const origin = request.headers.get('origin');
  if (!origin) return NextResponse.next();

  let requestOrigin;
  try {
    requestOrigin = new URL(request.url).origin;
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'BAD_REQUEST', message: 'Invalid request origin.' } },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  if (origin !== requestOrigin) {
    return NextResponse.json(
      { success: false, error: { code: 'FORBIDDEN', message: 'Cross-origin mutation rejected.' } },
      { status: 403, headers: { 'Cache-Control': 'no-store', Vary: 'Origin' } },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
