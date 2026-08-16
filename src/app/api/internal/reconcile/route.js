import { NextResponse } from 'next/server';
import { releaseExpiredReservations } from '../../../../server/inventory/reconciliation.js';

function authorized(request) {
  const expected = process.env.RECONCILIATION_SECRET;
  const supplied = request.headers.get('authorization');
  if (!expected || !supplied) return false;
  return supplied === `Bearer ${expected}`;
}

export async function POST(request) {
  if (!authorized(request)) {
    return NextResponse.json({ success: false, error: { message: 'Unauthorized.' } }, { status: 401 });
  }

  try {
    const result = await releaseExpiredReservations();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Reservation reconciliation failed:', error);
    return NextResponse.json({ success: false, error: { message: 'Reconciliation failed.' } }, { status: 500 });
  }
}
