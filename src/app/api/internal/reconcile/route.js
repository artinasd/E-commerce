import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { releaseExpiredReservations } from '../../../../server/inventory/reconciliation.js';

function authorized(request) {
  const supplied = request.headers.get('authorization');
  if (!supplied || !supplied.startsWith('Bearer ')) return false;

  const expected = process.env.RECONCILIATION_SECRET || process.env.CRON_SECRET;
  if (!expected) return false;

  const token = supplied.slice('Bearer '.length);
  const suppliedBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);

  return suppliedBuffer.length === expectedBuffer.length
    && timingSafeEqual(suppliedBuffer, expectedBuffer);
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
