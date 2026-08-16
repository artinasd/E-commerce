import { addFavorite, findFavorite, listFavoritesForUser, removeFavorite } from '../db/repositories/favorites.js';
import { findProductById } from '../db/repositories/catalog.js';

function productId(value) {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('Invalid product id.');
  return id;
}

export async function getUserFavorites(userId) {
  return listFavoritesForUser(userId);
}

export async function getFavoriteState(userId, value) {
  const id = productId(value);
  return Boolean(await findFavorite(userId, id));
}

export async function toggleFavorite(userId, value) {
  const id = productId(value);
  const product = await findProductById(id);
  if (!product || product.status !== 'ACTIVE') throw new Error('Product not found.');
  const existing = await findFavorite(userId, id);
  if (existing) {
    await removeFavorite(userId, id);
    return { productId: id, isFavorite: false };
  }
  await addFavorite(userId, id);
  return { productId: id, isFavorite: true };
}
