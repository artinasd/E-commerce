import { query } from '../connection.js';

export async function listApprovedReviewsForProduct(productId, { limit = 20, offset = 0 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  return query(
    `SELECT r.id, r.product_id, r.rating, r.title, r.content, r.created_at,
            u.first_name, u.last_name
       FROM reviews r
       INNER JOIN users u ON u.id = r.user_id
      WHERE r.product_id = ? AND r.status = 'APPROVED'
      ORDER BY r.created_at DESC, r.id DESC
      LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    [productId],
  );
}

export async function getProductReviewSummary(productId) {
  const rows = await query(
    `SELECT COUNT(*) AS review_count,
            COALESCE(AVG(rating), 0) AS average_rating
       FROM reviews
      WHERE product_id = ? AND status = 'APPROVED'`,
    [productId],
  );
  const row = rows[0] || {};
  return { reviewCount: Number(row.review_count || 0), averageRating: Number(row.average_rating || 0) };
}

export async function findReviewByOrderItemForUser(orderItemId, userId) {
  const rows = await query(
    `SELECT r.id, r.product_id, r.order_item_id, r.rating, r.title, r.content, r.status
       FROM reviews r
      WHERE r.order_item_id = ? AND r.user_id = ?
      LIMIT 1`,
    [orderItemId, userId],
  );
  return rows[0] ?? null;
}

export async function findEligibleOrderItem(userId, productId, orderItemId) {
  const rows = await query(
    `SELECT oi.id, oi.order_id, oi.variant_id, oi.product_name, p.id AS product_id
       FROM order_items oi
       INNER JOIN orders o ON o.id = oi.order_id
       INNER JOIN product_variants v ON v.id = oi.variant_id
       INNER JOIN products p ON p.id = v.product_id
      WHERE oi.id = ?
        AND o.user_id = ?
        AND o.status = 'DELIVERED'
        AND o.payment_status = 'PAID'
        AND p.id = ?
      LIMIT 1`,
    [orderItemId, userId, productId],
  );
  return rows[0] ?? null;
}

export async function createReview({ userId, productId, orderItemId, rating, title, content }) {
  const result = await query(
    `INSERT INTO reviews (user_id, product_id, order_item_id, rating, title, content, status)
     VALUES (?, ?, ?, ?, ?, ?, 'PENDING')`,
    [userId, productId, orderItemId, rating, title || null, content || null],
  );
  return Number(result.insertId);
}
