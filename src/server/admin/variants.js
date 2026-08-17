import { withTransaction } from '../db/connection.js';
import { requireRole } from '../../lib/auth/session.js';

const admin = () => requireRole(['ADMIN', 'SUPER_ADMIN']);

function normalizeVariant({ sku, name, price, compareAtPrice = null, quantity = 0, lowStockThreshold = 5 }) {
  const normalizedSku = typeof sku === 'string' ? sku.trim() : '';
  if (!normalizedSku) throw new Error('SKU is required.');
  const numericPrice = Number(price);
  if (!Number.isInteger(numericPrice) || numericPrice < 0) throw new Error('Invalid price.');
  const numericCompareAtPrice = compareAtPrice == null || compareAtPrice === '' ? null : Number(compareAtPrice);
  if (numericCompareAtPrice !== null && (!Number.isInteger(numericCompareAtPrice) || numericCompareAtPrice < 0)) throw new Error('Invalid compare-at price.');
  if (numericCompareAtPrice !== null && numericCompareAtPrice <= numericPrice) throw new Error('قیمت قبل از تخفیف باید بیشتر از قیمت فعلی باشد.');
  const stock = Number(quantity);
  if (!Number.isInteger(stock) || stock < 0) throw new Error('Invalid inventory quantity.');
  const threshold = Number(lowStockThreshold);
  if (!Number.isInteger(threshold) || threshold < 0) throw new Error('Invalid low-stock threshold.');
  return { normalizedSku, name: name?.trim() || null, numericPrice, numericCompareAtPrice, stock, threshold };
}

export async function createVariant({ productId, sku, name, price, compareAtPrice = null, quantity = 0, lowStockThreshold = 5 }) {
  await admin();
  const v = normalizeVariant({ sku, name, price, compareAtPrice, quantity, lowStockThreshold });
  return withTransaction(async (connection) => {
    const [products] = await connection.execute('SELECT id FROM products WHERE id = ? AND deleted_at IS NULL', [productId]);
    if (!products[0]) throw new Error('Product not found.');
    const [existing] = await connection.execute('SELECT id FROM product_variants WHERE sku = ? LIMIT 1', [v.normalizedSku]);
    if (existing[0]) throw new Error('SKU already exists.');
    const [variantResult] = await connection.execute(`INSERT INTO product_variants (product_id, sku, name, price, compare_at_price, is_active) VALUES (?, ?, ?, ?, ?, 1)`, [productId, v.normalizedSku, v.name, v.numericPrice, v.numericCompareAtPrice]);
    await connection.execute(`INSERT INTO inventory (variant_id, quantity, reserved_quantity, low_stock_threshold) VALUES (?, ?, 0, ?)`, [variantResult.insertId, v.stock, v.threshold]);
    return { id: variantResult.insertId, productId, sku: v.normalizedSku, name: v.name, price: v.numericPrice, compareAtPrice: v.numericCompareAtPrice, quantity: v.stock, reservedQuantity: 0, lowStockThreshold: v.threshold };
  });
}

export async function updateVariant(variantId, { sku, name, price, compareAtPrice = null, quantity = 0, lowStockThreshold = 5 }) {
  await admin();
  const v = normalizeVariant({ sku, name, price, compareAtPrice, quantity, lowStockThreshold });
  return withTransaction(async (connection) => {
    const [rows] = await connection.execute('SELECT id, product_id FROM product_variants WHERE id = ? LIMIT 1', [variantId]);
    if (!rows[0]) throw new Error('Variant not found.');
    const [existing] = await connection.execute('SELECT id FROM product_variants WHERE sku = ? AND id <> ? LIMIT 1', [v.normalizedSku, variantId]);
    if (existing[0]) throw new Error('SKU already exists.');
    await connection.execute('UPDATE product_variants SET sku = ?, name = ?, price = ?, compare_at_price = ? WHERE id = ?', [v.normalizedSku, v.name, v.numericPrice, v.numericCompareAtPrice, variantId]);
    await connection.execute(`INSERT INTO inventory (variant_id, quantity, reserved_quantity, low_stock_threshold) VALUES (?, ?, 0, ?) ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), low_stock_threshold = VALUES(low_stock_threshold)`, [variantId, v.stock, v.threshold]);
    const [updated] = await connection.execute(`SELECT v.id, v.product_id, v.sku, v.name, v.price, v.compare_at_price, v.is_active, COALESCE(i.quantity,0) quantity, COALESCE(i.reserved_quantity,0) reserved_quantity, COALESCE(i.low_stock_threshold,5) low_stock_threshold FROM product_variants v LEFT JOIN inventory i ON i.variant_id=v.id WHERE v.id=? LIMIT 1`, [variantId]);
    return updated[0];
  });
}
