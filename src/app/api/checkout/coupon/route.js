import { requireUser } from '../../../../lib/auth/session.js';
import { withTransaction } from '../../../../server/db/connection.js';
import { getOrCreateCart, listCartItems } from '../../../../server/db/repositories/cart.js';
import { calculateOrderPricing } from '../../../../server/pricing/service.js';
import { findApplicablePromotion } from '../../../../server/pricing/promotions.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';

export async function POST(request) {
  try {
    const user = await requireUser();
    const payload = await request.json();
    const code = typeof payload?.code === 'string' ? payload.code.trim().toUpperCase() : '';

    if (!code || code.length > 64) {
      return apiErrorResponse(new Error('Invalid coupon code.'), 'Unable to apply coupon.');
    }

    const cart = await getOrCreateCart(user.id);
    const items = await listCartItems(cart.id);
    if (!items.length) {
      return apiErrorResponse(new Error('Cart is empty.'), 'Unable to apply coupon.');
    }

    const pricing = calculateOrderPricing(items);
    const promotion = await withTransaction(async (connection) => (
      findApplicablePromotion(connection, { userId: user.id, code, subtotal: pricing.subtotal })
    ));

    return apiSuccess({
      promotion: {
        id: promotion.id,
        code: promotion.code,
        name: promotion.name,
        discountAmount: promotion.discountAmount,
      },
      pricing: {
        subtotal: pricing.subtotal,
        discountAmount: promotion.discountAmount,
        total: Math.max(0, pricing.subtotal - promotion.discountAmount),
      },
    });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to apply coupon.');
  }
}
