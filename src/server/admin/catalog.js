import { query } from '../db/connection.js';
import { requireRole } from '../../lib/auth/session.js';

const admin = () => requireRole(['ADMIN', 'SUPER_ADMIN']);

function normalizeText(value, field, max) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!text) throw new Error(`${field} is required.`);
  if (text.length > max) throw new Error(`${field} is too long.`);
  return text;
}

function normalizeSlug(value, fallback) {
  const raw = typeof value === 'string' ? value.trim().toLowerCase() : '';
  const slug = raw || fallback;
  const normalized = slug
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
  if (!normalized) throw new Error('Slug is required.');
  return normalized;
}

export async function listAdminCategories() {
  await admin();
  return query(`SELECT id, parent_id, name, slug, description, is_active, sort_order FROM categories WHERE deleted_at IS NULL ORDER BY sort_order ASC, name ASC`);
}

export async function listAdminBrands() {
  await admin();
  return query(`SELECT id, name, slug, description, logo_url, is_active FROM brands WHERE deleted_at IS NULL ORDER BY name ASC`);
}

export async function createAdminBrand({ name, slug, description = null, logoUrl = null, isActive = true } = {}) {
  await admin();
  const normalizedName = normalizeText(name, 'نام برند', 150);
  const normalizedSlug = normalizeSlug(slug, normalizedName);
  const active = Boolean(isActive);
  const logo = typeof logoUrl === 'string' && logoUrl.trim() ? logoUrl.trim().slice(0, 1000) : null;
  const desc = typeof description === 'string' && description.trim() ? description.trim().slice(0, 65535) : null;
  const existing = await query('SELECT id FROM brands WHERE slug = ? LIMIT 1', [normalizedSlug]);
  if (existing[0]) throw new Error('این slug برای یک برند دیگر استفاده شده است.');
  const result = await query('INSERT INTO brands (name, slug, description, logo_url, is_active) VALUES (?, ?, ?, ?, ?)', [normalizedName, normalizedSlug, desc, logo, active]);
  return { id: result.insertId, name: normalizedName, slug: normalizedSlug, description: desc, logo_url: logo, is_active: active };
}

export async function createAdminCategory({ name, slug, description = null, imageUrl = null, parentId = null, isActive = true, sortOrder = 0 } = {}) {
  await admin();
  const normalizedName = normalizeText(name, 'نام دسته‌بندی', 150);
  const normalizedSlug = normalizeSlug(slug, normalizedName);
  const parent = parentId == null || parentId === '' ? null : Number(parentId);
  if (parent !== null && (!Number.isSafeInteger(parent) || parent < 1)) throw new Error('Invalid parent category.');
  if (parent !== null) {
    const parentRows = await query('SELECT id FROM categories WHERE id = ? AND deleted_at IS NULL LIMIT 1', [parent]);
    if (!parentRows[0]) throw new Error('دسته‌بندی والد پیدا نشد.');
  }
  const order = Number(sortOrder);
  if (!Number.isInteger(order)) throw new Error('Invalid sort order.');
  const existing = await query('SELECT id FROM categories WHERE slug = ? LIMIT 1', [normalizedSlug]);
  if (existing[0]) throw new Error('این slug برای یک دسته‌بندی دیگر استفاده شده است.');
  const desc = typeof description === 'string' && description.trim() ? description.trim().slice(0, 65535) : null;
  const image = typeof imageUrl === 'string' && imageUrl.trim() ? imageUrl.trim().slice(0, 1000) : null;
  const active = Boolean(isActive);
  const result = await query('INSERT INTO categories (parent_id, name, slug, description, image_url, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)', [parent, normalizedName, normalizedSlug, desc, image, active, order]);
  return { id: result.insertId, parent_id: parent, name: normalizedName, slug: normalizedSlug, description: desc, image_url: image, is_active: active, sort_order: order };
}

export async function getAdminProduct(productId) {
  await admin();

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
