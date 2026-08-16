import { placeOrderFromCart } from '../db/repositories/checkout.js';

export async function checkoutFromCart(userId, payload) {
  const addressId = Number(payload?.addressId);
  if (!Number.isSafeInteger(addressId) || addressId < 1) {
    throw new Error('A valid shipping address is required.');
  }
  return placeOrderFromCart(userId, addressId);
}
