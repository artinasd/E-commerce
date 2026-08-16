import { query } from '../db/connection.js';

export async function listReviewsForModeration({ status = 'PENDING', limit = 50, offset = 0 } = {}) {
  const allowedStatuses = new Set(['PENDING', 'APPROVED', 'REJECTED']);
  const safeStatus = allowedStatuses.has(status) ? status : 'PENDING';
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  return query(
    `SELECT r.id, r.product_id, r.order_item_id, r.rating, r.title, r.content,
            r.status, r.created_at, r.updated_at,
            u.first_name, u.last_name, u.email,
            p.name AS product_name
       FROM reviews r
       INNER JOIN users u ON u.id = r.user_id
       INNER JOIN products p ON p.id = r.product_id
      WHERE r.status = ?
      ORDER BY r.created_at ASC, r.id ASC
      LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    [safeStatus],
  );
}

export async function findReviewForModeration(reviewId) {
  const rows = await query(
    `SELECT r.id, r.status, r.product_id, r.user_id, r.order_item_id
       FROM reviews r
      WHERE r.id = ?
      LIMIT 1`,
    [reviewId],
  );
  return rows[0] ?? null;
}

export async function setReviewModerationStatus(reviewId, status) {
  const result = await query(
    `UPDATE reviews
        SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
    [status, reviewId],
  );
  return result.affectedRows > 0;
}
