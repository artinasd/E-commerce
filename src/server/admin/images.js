import { withTransaction } from '../db/connection.js';
import { requireRole } from '../../lib/auth/session.js';

async function admin() { await requireRole(['ADMIN', 'SUPER_ADMIN']); }

function validateImageUrl(value) {
  const url = String(value || '').trim();
  if (!url) throw new Error('Image URL is required.');
  if (url.length > 2048) throw new Error('Image URL is too long.');
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Image URL must use HTTP or HTTPS.');
  } catch (error) {
    if (error?.message === 'Image URL must use HTTP or HTTPS.') throw error;
    throw new Error('Image URL must be a valid HTTP or HTTPS URL.');
  }
  return url;
}

export async function addProductImage({ productId, variantId = null, url, altText = null, sortOrder = 0, isPrimary = false }) {
  await admin();
  const imageUrl = validateImageUrl(url);
  return withTransaction(async (connection) => {
    const [products] = await connection.execute('SELECT id FROM products WHERE id = ? AND deleted_at IS NULL', [productId]);
    if (!products[0]) throw new Error('Product not found.');
    if (variantId) {
      const [variants] = await connection.execute('SELECT id FROM product_variants WHERE id = ? AND product_id = ? AND deleted_at IS NULL', [variantId, productId]);
      if (!variants[0]) throw new Error('Variant does not belong to product.');
    }
    if (isPrimary) await connection.execute('UPDATE product_images SET is_primary = 0 WHERE product_id = ?', [productId]);
    const [result] = await connection.execute('INSERT INTO product_images (product_id, variant_id, url, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?, ?)', [productId, variantId || null, imageUrl, altText?.trim() || null, Number(sortOrder) || 0, Boolean(isPrimary)]);
    return { id: result.insertId, productId, variantId: variantId || null, url: imageUrl, altText: altText?.trim() || null, sortOrder: Number(sortOrder) || 0, isPrimary: Boolean(isPrimary) };
  });
}

export async function updateProductImage(imageId, { sortOrder, isPrimary }) {
  await admin();
  return withTransaction(async (connection) => {
    const [images] = await connection.execute('SELECT id, product_id, variant_id, url, alt_text, sort_order, is_primary FROM product_images WHERE id = ? LIMIT 1', [imageId]);
    const image = images[0];
    if (!image) throw new Error('Image not found.');

    if (isPrimary === true) await connection.execute('UPDATE product_images SET is_primary = 0 WHERE product_id = ?', [image.product_id]);

    const nextSortOrder = sortOrder === undefined ? image.sort_order : Math.max(Number(sortOrder) || 0, 0);
    const nextPrimary = isPrimary === undefined ? Boolean(image.is_primary) : Boolean(isPrimary);
    await connection.execute('UPDATE product_images SET sort_order = ?, is_primary = ? WHERE id = ?', [nextSortOrder, nextPrimary, imageId]);

    return {
      id: Number(image.id),
      productId: Number(image.product_id),
      variantId: image.variant_id ? Number(image.variant_id) : null,
      url: image.url,
      altText: image.alt_text,
      sortOrder: nextSortOrder,
      isPrimary: nextPrimary,
    };
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
