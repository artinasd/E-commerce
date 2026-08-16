import { withTransaction } from '../db/connection.js';
import { requireRole } from '../../lib/auth/session.js';

const admin = () => requireRole(['ADMIN', 'SUPER_ADMIN']);

export async function createVariant({ productId, sku, name, price, compareAtPrice = null, quantity = 0, lowStockThreshold = 5 }) {
  await admin();
  if (!sku?.trim()) throw new Error('SKU is required.');
  const numericPrice = Number(price);
  if (!Number.isInteger(numericPrice) || numericPrice < 0) throw new Error('Invalid price.');
  const stock = Number(quantity);
  if (!Number.isInteger(stock) || stock < 0) throw new Error('Invalid inventory quantity.');
  return withTransaction(async (connection) => {
    const [products] = await connection.execute('SELECT id FROM products WHERE id = ? AND deleted_at IS NULL', [productId]);
    if (!products[0]) throw new Error('Product not found.');
    const [existing] = await connection.execute('SELECT id FROM product_variants WHERE sku = ? AND deleted_at IS NULL', [sku.trim()]);
    if (existing[0]) throw new Error('SKU already exists.');
    const [variantResult] = await connection.execute('INSERT INTO product_variants (product_id, sku, name, price, compare_at_price, is_active) VALUES (?, ?, ?, ?, ?, 1)', [productId, sku.trim(), name?.trim() || null, numericPrice, compareAtPrice == null || compareAtPrice === '' ? null : Number(compareAtPrice)]);
    await connection.execute('INSERT INTO inventory (variant_id, quantity, reserved_quantity, low_stock_threshold) VALUES (?, ?, 0, ?)', [variantResult.insertId, stock, Number(lowStockThreshold) || 5]);
    return { id: variantResult.insertId, productId, sku: sku.trim(), name: name?.trim() || null, price: numericPrice, quantity: stock };
  });
}
