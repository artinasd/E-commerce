import { findOrderByIdForUser, listOrderItems, listOrdersForUser } from '../db/repositories/orders.js';

function normalizeId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export async function getUserOrder(userId, orderId) {
  const id = normalizeId(orderId);
  if (!id) return null;
  const order = await findOrderByIdForUser(id, userId);
  if (!order) return null;
  return { ...order, items: await listOrderItems(id) };
}

export async function getUserOrders(userId, { page = 1, limit = 20 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const safePage = Math.max(Number(page) || 1, 1);
  const orders = await listOrdersForUser(userId, { limit: safeLimit, offset: (safePage - 1) * safeLimit });
  return { orders, page: safePage, limit: safeLimit, hasMore: orders.length === safeLimit };
}
