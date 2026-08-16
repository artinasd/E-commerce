import { placeOrderFromCart } from '../db/repositories/checkout.js';

export async function checkoutFromCart(userId, payload) {
  const addressId = Number(payload?.addressId);
  if (!Number.isSafeInteger(addressId) || addressId < 1) {
    throw new Error('A valid shipping address is required.');
  }

  const shippingMethodId = Number(payload?.shippingMethodId);
  if (!Number.isSafeInteger(shippingMethodId) || shippingMethodId < 1) {
    throw new Error('A valid shipping method is required.');
  }

  const couponCode = typeof payload?.couponCode === 'string' ? payload.couponCode.trim() : '';
  if (couponCode.length > 64) throw new Error('Promotion code is too long.');

  return placeOrderFromCart(userId, addressId, {
    couponCode: couponCode || null,
    shippingMethodId,
  });
}
