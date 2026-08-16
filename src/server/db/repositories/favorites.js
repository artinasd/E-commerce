import { query } from '../connection.js';

export async function listFavoritesForUser(userId) {
  return query(`
    SELECT
      p.id, p.name, p.slug, p.short_description, p.status,
      p.category_id, c.name AS category_name,
      p.brand_id, b.name AS brand_name,
      (SELECT MIN(v.price) FROM product_variants v WHERE v.product_id = p.id AND v.is_active = TRUE) AS price,
      (SELECT v.compare_at_price FROM product_variants v WHERE v.product_id = p.id AND v.is_active = TRUE ORDER BY v.price ASC, v.id ASC LIMIT 1) AS compare_at_price,
      (SELECT pi.url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.is_primary DESC, pi.sort_order ASC, pi.id ASC LIMIT 1) AS primary_image_url,
      f.created_at AS favorited_at
    FROM favorites f
    INNER JOIN products p ON p.id = f.product_id AND p.deleted_at IS NULL
    LEFT JOIN categories c ON c.id = p.category_id AND c.deleted_at IS NULL
    LEFT JOIN brands b ON b.id = p.brand_id AND b.deleted_at IS NULL
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `, [userId]);
}

export async function findFavorite(userId, productId) {
  const rows = await query('SELECT user_id, product_id FROM favorites WHERE user_id = ? AND product_id = ? LIMIT 1', [userId, productId]);
  return rows[0] ?? null;
}

export async function addFavorite(userId, productId) {
  await query('INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)', [userId, productId]);
  return findFavorite(userId, productId);
}

export async function removeFavorite(userId, productId) {
  await query('DELETE FROM favorites WHERE user_id = ? AND product_id = ?', [userId, productId]);
  return true;
}
