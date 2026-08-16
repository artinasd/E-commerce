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
  return query(`SELECT p.id, p.name, p.slug, p.is_active, p.brand_id, p.category_id, p.created_at, COUNT(v.id) AS variant_count, COALESCE(SUM(GREATEST(i.quantity - i.reserved_quantity, 0)), 0) AS available_units FROM products p LEFT JOIN product_variants v ON v.product_id = p.id AND v.deleted_at IS NULL LEFT JOIN inventory i ON i.variant_id = v.id WHERE ${where.join(' AND ')} GROUP BY p.id ORDER BY p.created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`, params);
}

export async function setProductActive(productId, isActive) {
  await admin();
  return withTransaction(async (connection) => {
    const [result] = await connection.execute('UPDATE products SET is_active = ? WHERE id = ? AND deleted_at IS NULL', [isActive ? 1 : 0, productId]);
    if (result.affectedRows !== 1) throw new Error('Product not found.');
    return { id: productId, is_active: Boolean(isActive) };
  });
}
