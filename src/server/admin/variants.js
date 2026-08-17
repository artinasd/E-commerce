import { withTransaction } from '../db/connection.js';
import { requireRole } from '../../lib/auth/session.js';

const admin = () => requireRole(['ADMIN', 'SUPER_ADMIN']);

export async function createVariant({ productId, sku, name, price, compareAtPrice = null, quantity = 0, lowStockThreshold = 5 }) {
  await admin();

  const normalizedSku = typeof sku === 'string' ? sku.trim() : '';
  if (!normalizedSku) throw new Error('SKU is required.');

  const numericPrice = Number(price);
  if (!Number.isInteger(numericPrice) || numericPrice < 0) throw new Error('Invalid price.');

  const numericCompareAtPrice = compareAtPrice == null || compareAtPrice === '' ? null : Number(compareAtPrice);
  if (numericCompareAtPrice !== null && (!Number.isInteger(numericCompareAtPrice) || numericCompareAtPrice < 0)) {
    throw new Error('Invalid compare-at price.');
  }

  const stock = Number(quantity);
  if (!Number.isInteger(stock) || stock < 0) throw new Error('Invalid inventory quantity.');

  const threshold = Number(lowStockThreshold);
  if (!Number.isInteger(threshold) || threshold < 0) throw new Error('Invalid low-stock threshold.');

  return withTransaction(async (connection) => {
    const [products] = await connection.execute(
      'SELECT id FROM products WHERE id = ? AND deleted_at IS NULL',
      [productId],
    );

    if (!products[0]) throw new Error('Product not found.');

    // product_variants has no deleted_at column in the current database schema.
    const [existing] = await connection.execute(
      'SELECT id FROM product_variants WHERE sku = ? LIMIT 1',
      [normalizedSku],
    );

    if (existing[0]) throw new Error('SKU already exists.');

    const [variantResult] = await connection.execute(
      `INSERT INTO product_variants
        (product_id, sku, name, price, compare_at_price, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [productId, normalizedSku, name?.trim() || null, numericPrice, numericCompareAtPrice],
    );

    await connection.execute(
      `INSERT INTO inventory
        (variant_id, quantity, reserved_quantity, low_stock_threshold)
       VALUES (?, ?, 0, ?)`,
      [variantResult.insertId, stock, threshold],
    );

    return {
      id: variantResult.insertId,
      productId,
      sku: normalizedSku,
      name: name?.trim() || null,
      price: numericPrice,
      compareAtPrice: numericCompareAtPrice,
      quantity: stock,
      reservedQuantity: 0,
      lowStockThreshold: threshold,
    };
  });
}
