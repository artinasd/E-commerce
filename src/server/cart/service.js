import { getOrCreateCart, listCartItems, addCartItem, updateCartItem, removeCartItem } from '../db/repositories/cart.js';

function toCart(cart, items) {
  const normalizedItems = items.map((item) => ({
    id: item.id,
    variantId: item.variant_id,
    productId: item.product_id,
    productName: item.product_name,
    productSlug: item.product_slug,
    sku: item.sku,
    variantName: item.variant_name,
    price: Number(item.price),
    compareAtPrice: item.compare_at_price == null ? null : Number(item.compare_at_price),
    quantity: Number(item.quantity),
    availableQuantity: Number(item.available_quantity),
    primaryImageUrl: item.primary_image_url,
    lineTotal: Number(item.price) * Number(item.quantity),
  }));

  return {
    id: cart.id,
    items: normalizedItems,
    itemCount: normalizedItems.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0),
  };
}

export async function getCart(userId) {
  const cart = await getOrCreateCart(userId);
  const items = await listCartItems(cart.id);
  return toCart(cart, items);
}

export async function addItem(userId, variantId, quantity) {
  await addCartItem(userId, variantId, quantity);
  return getCart(userId);
}

export async function updateItem(userId, itemId, quantity) {
  await updateCartItem(userId, itemId, quantity);
  return getCart(userId);
}

export async function removeItem(userId, itemId) {
  const removed = await removeCartItem(userId, itemId);
  if (!removed) {
    const error = new Error('Cart item not found.');
    error.code = 'NOT_FOUND';
    throw error;
  }
  return getCart(userId);
}
