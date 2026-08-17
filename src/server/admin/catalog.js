import { query } from '../db/connection.js';
import { requireRole } from '../../lib/auth/session.js';

export async function listAdminCategories() {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  return query(`SELECT id, parent_id, name, slug, is_active, sort_order FROM categories WHERE deleted_at IS NULL ORDER BY sort_order ASC, name ASC`);
}

export async function listAdminBrands() {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  return query(`SELECT id, name, slug, is_active FROM brands WHERE deleted_at IS NULL ORDER BY name ASC`);
}

export async function getAdminProduct(productId) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);

  const [products, variants, images] = await Promise.all([
    query(`
      SELECT
        p.id,
        p.category_id,
        p.brand_id,
        p.name,
        p.slug,
        p.short_description,
        p.description,
        p.status,
        p.is_featured,
        p.meta_title AS seo_title,
        p.meta_description AS seo_description
      FROM products p
      WHERE p.id = ? AND p.deleted_at IS NULL
      LIMIT 1
    `, [productId]),
    query(`
      SELECT
        v.id,
        v.sku,
        v.name,
        v.price,
        v.compare_at_price,
        v.is_active,
        COALESCE(i.quantity, 0) AS quantity,
        COALESCE(i.reserved_quantity, 0) AS reserved_quantity,
        COALESCE(i.low_stock_threshold, 5) AS low_stock_threshold
      FROM product_variants v
      LEFT JOIN inventory i ON i.variant_id = v.id
      WHERE v.product_id = ?
      ORDER BY v.id ASC
    `, [productId]),
    query(`
      SELECT id, variant_id, url, alt_text, sort_order, is_primary
      FROM product_images
      WHERE product_id = ?
      ORDER BY is_primary DESC, sort_order ASC, id ASC
    `, [productId]),
  ]);

  return products[0] ? { product: products[0], variants, images } : null;
}
