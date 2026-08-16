import { query, withTransaction } from '../db/connection.js';
import { requireRole } from '../../lib/auth/session.js';

async function admin() { await requireRole(['ADMIN', 'SUPER_ADMIN']); }

export async function listAdminProducts({ search = null, limit = 50, offset = 0 } = {}) {
  await admin();
  const params = [];
  const where = ['p.deleted_at IS NULL'];
  if (search) { where.push('(p.name LIKE ? OR p.slug LIKE ? OR v.sku LIKE ?)'); const q = `%${search}%`; params.push(q, q, q); }
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  return query(`SELECT p.id, p.name, p.slug, p.status, p.is_featured, p.brand_id, p.category_id, p.created_at, COUNT(v.id) AS variant_count, COALESCE(SUM(GREATEST(i.quantity - i.reserved_quantity, 0)), 0) AS available_units FROM products p LEFT JOIN product_variants v ON v.product_id = p.id AND v.deleted_at IS NULL LEFT JOIN inventory i ON i.variant_id = v.id WHERE ${where.join(' AND ')} GROUP BY p.id ORDER BY p.created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`, params);
}

export async function setProductStatus(productId, status) {
  await admin();
  if (!['DRAFT', 'ACTIVE', 'ARCHIVED'].includes(status)) throw new Error('Invalid product status.');
  return withTransaction(async (connection) => {
    const [result] = await connection.execute('UPDATE products SET status = ? WHERE id = ? AND deleted_at IS NULL', [status, productId]);
    if (result.affectedRows !== 1) throw new Error('Product not found.');
    return { id: productId, status };
  });
}

export async function createAdminProduct({ name, slug, shortDescription = null, description = null, categoryId = null, brandId = null, status = 'DRAFT', isFeatured = false }) {
  await admin();
  if (!name?.trim() || !slug?.trim()) throw new Error('Product name and slug are required.');
  if (!['DRAFT', 'ACTIVE', 'ARCHIVED'].includes(status)) throw new Error('Invalid product status.');
  return withTransaction(async (connection) => {
    const [result] = await connection.execute(`INSERT INTO products (category_id, brand_id, name, slug, short_description, description, status, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [categoryId || null, brandId || null, name.trim(), slug.trim(), shortDescription || null, description || null, status, Boolean(isFeatured)]);
    return { id: result.insertId, name: name.trim(), slug: slug.trim(), status };
  });
}
