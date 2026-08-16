import { query } from '../connection.js';

const PRODUCT_SELECT = `
  SELECT
    p.id,
    p.name,
    p.slug,
    p.short_description,
    p.description,
    p.status,
    p.is_featured,
    p.category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    p.brand_id,
    b.name AS brand_name,
    b.slug AS brand_slug,
    p.created_at,
    p.updated_at
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id AND c.deleted_at IS NULL
  LEFT JOIN brands b ON b.id = p.brand_id AND b.deleted_at IS NULL
`;

export async function findProductById(id) {
  const rows = await query(
    `${PRODUCT_SELECT}
     WHERE p.id = ? AND p.deleted_at IS NULL
     LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function findProductBySlug(slug) {
  const rows = await query(
    `${PRODUCT_SELECT}
     WHERE p.slug = ? AND p.deleted_at IS NULL
     LIMIT 1`,
    [slug],
  );
  return rows[0] ?? null;
}

export async function listProducts({
  categoryId = null,
  brandId = null,
  status = 'ACTIVE',
  search = null,
  limit = 24,
  offset = 0,
} = {}) {
  const conditions = ['p.deleted_at IS NULL'];
  const params = [];

  if (status) {
    conditions.push('p.status = ?');
    params.push(status);
  }

  if (categoryId !== null) {
    conditions.push('p.category_id = ?');
    params.push(categoryId);
  }

  if (brandId !== null) {
    conditions.push('p.brand_id = ?');
    params.push(brandId);
  }

  if (search) {
    conditions.push('(p.name LIKE ? OR p.short_description LIKE ?)');
    const pattern = `%${search}%`;
    params.push(pattern, pattern);
  }

  const safeLimit = Math.min(Math.max(Number(limit) || 24, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  return query(
    `${PRODUCT_SELECT}
     WHERE ${conditions.join(' AND ')}
     ORDER BY p.is_featured DESC, p.created_at DESC, p.id DESC
     LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    params,
  );
}

export async function countProducts({
  categoryId = null,
  brandId = null,
  status = 'ACTIVE',
  search = null,
} = {}) {
  const conditions = ['p.deleted_at IS NULL'];
  const params = [];

  if (status) {
    conditions.push('p.status = ?');
    params.push(status);
  }

  if (categoryId !== null) {
    conditions.push('p.category_id = ?');
    params.push(categoryId);
  }

  if (brandId !== null) {
    conditions.push('p.brand_id = ?');
    params.push(brandId);
  }

  if (search) {
    conditions.push('(p.name LIKE ? OR p.short_description LIKE ?)');
    const pattern = `%${search}%`;
    params.push(pattern, pattern);
  }

  const rows = await query(
    `SELECT COUNT(*) AS total
       FROM products p
      WHERE ${conditions.join(' AND ')}`,
    params,
  );

  return Number(rows[0]?.total ?? 0);
}

export async function findProductVariants(productId) {
  return query(
    `SELECT
       v.id,
       v.product_id,
       v.sku,
       v.name,
       v.price,
       v.compare_at_price,
       v.is_active,
       i.quantity,
       i.reserved_quantity,
       GREATEST(i.quantity - i.reserved_quantity, 0) AS available_quantity
     FROM product_variants v
     LEFT JOIN inventory i ON i.variant_id = v.id
     WHERE v.product_id = ? AND v.is_active = TRUE
     ORDER BY v.id ASC`,
    [productId],
  );
}

export async function findProductImages(productId) {
  return query(
    `SELECT id, product_id, variant_id, url, alt_text, sort_order, is_primary
       FROM product_images
      WHERE product_id = ?
      ORDER BY is_primary DESC, sort_order ASC, id ASC`,
    [productId],
  );
}

export async function listCategories({ parentId = null, activeOnly = true } = {}) {
  const conditions = ['deleted_at IS NULL'];
  const params = [];

  if (activeOnly) conditions.push('is_active = TRUE');

  if (parentId === null) {
    conditions.push('parent_id IS NULL');
  } else {
    conditions.push('parent_id = ?');
    params.push(parentId);
  }

  return query(
    `SELECT id, parent_id, name, slug, description, image_url, is_active, sort_order
       FROM categories
      WHERE ${conditions.join(' AND ')}
      ORDER BY sort_order ASC, name ASC`,
    params,
  );
}

export async function findCategoryBySlug(slug) {
  const rows = await query(
    `SELECT id, parent_id, name, slug, description, image_url, is_active, sort_order
       FROM categories
      WHERE slug = ? AND deleted_at IS NULL
      LIMIT 1`,
    [slug],
  );
  return rows[0] ?? null;
}

export async function listBrands({ activeOnly = true, limit = 100 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 250);
  return query(
    `SELECT id, name, slug, description, logo_url, is_active
       FROM brands
      WHERE deleted_at IS NULL${activeOnly ? ' AND is_active = TRUE' : ''}
      ORDER BY name ASC
      LIMIT ${safeLimit}`,
  );
}

export async function findBrandBySlug(slug) {
  const rows = await query(
    `SELECT id, name, slug, description, logo_url, is_active
       FROM brands
      WHERE slug = ? AND deleted_at IS NULL
      LIMIT 1`,
    [slug],
  );
  return rows[0] ?? null;
}
