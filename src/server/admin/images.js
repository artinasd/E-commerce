import { withTransaction } from '../db/connection.js';
import { requireRole } from '../../lib/auth/session.js';

async function admin() { await requireRole(['ADMIN', 'SUPER_ADMIN']); }

export async function addProductImage({ productId, variantId = null, url, altText = null, sortOrder = 0, isPrimary = false }) {
  await admin();
  if (!url?.trim()) throw new Error('Image URL is required.');
  return withTransaction(async (connection) => {
    const [products] = await connection.execute('SELECT id FROM products WHERE id = ? AND deleted_at IS NULL', [productId]);
    if (!products[0]) throw new Error('Product not found.');
    if (variantId) {
      const [variants] = await connection.execute('SELECT id FROM product_variants WHERE id = ? AND product_id = ? AND deleted_at IS NULL', [variantId, productId]);
      if (!variants[0]) throw new Error('Variant does not belong to product.');
    }
    if (isPrimary) await connection.execute('UPDATE product_images SET is_primary = 0 WHERE product_id = ?', [productId]);
    const [result] = await connection.execute('INSERT INTO product_images (product_id, variant_id, url, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?, ?)', [productId, variantId || null, url.trim(), altText?.trim() || null, Number(sortOrder) || 0, Boolean(isPrimary)]);
    return { id: result.insertId, productId, variantId: variantId || null, url: url.trim(), altText: altText?.trim() || null, sortOrder: Number(sortOrder) || 0, isPrimary: Boolean(isPrimary) };
  });
}

export async function deleteProductImage(imageId) {
  await admin();
  return withTransaction(async (connection) => {
    const [result] = await connection.execute('DELETE FROM product_images WHERE id = ?', [imageId]);
    if (result.affectedRows !== 1) throw new Error('Image not found.');
    return { id: Number(imageId) };
  });
}
