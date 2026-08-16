import { NextResponse } from 'next/server';
import { handlePaymentCallback } from '../../../../server/payments/callback.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  try {
    const result = await handlePaymentCallback(searchParams);
    const orderId = result.payment?.order_id;
    const baseUrl = process.env.APP_URL;
    if (!baseUrl || !orderId) return NextResponse.json({ success: true, data: result }, { status: 200 });
    return NextResponse.redirect(new URL(`/orders/${encodeURIComponent(orderId)}?payment=success`, baseUrl));
  } catch (error) {
    const baseUrl = process.env.APP_URL;
    if (baseUrl) {
      const target = new URL('/orders', baseUrl);
      target.searchParams.set('payment', 'failed');
      return NextResponse.redirect(target);
    }
    return NextResponse.json({ success: false, error: { message: 'Payment verification failed.' } }, { status: error.statusCode || 400 });
  }
}
