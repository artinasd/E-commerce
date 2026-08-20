import {
  listProducts,
  countProducts,
  findProductBySlug,
  findProductVariants,
  findProductImages,
  listCategories,
  findCategoryBySlug,
  listBrands,
  findBrandBySlug,
} from '../db/repositories/catalog.js';

function getCategoryTreeIds(categories, rootId) {
  const childrenByParent = new Map();
  for (const category of categories) {
    const parentId = category.parent_id == null ? null : Number(category.parent_id);
    if (!childrenByParent.has(parentId)) childrenByParent.set(parentId, []);
    childrenByParent.get(parentId).push(Number(category.id));
  }

  const ids = [];
  const queue = [Number(rootId)];
  const seen = new Set();
  while (queue.length) {
    const id = queue.shift();
    if (seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
    for (const childId of childrenByParent.get(id) || []) queue.push(childId);
  }
  return ids;
}

export async function getProducts(params = {}) {
  const page = Math.max(Number(params.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params.limit) || 24, 1), 100);
  const [category, brand] = await Promise.all([
    params.categorySlug ? findCategoryBySlug(params.categorySlug) : null,
    params.brandSlug ? findBrandBySlug(params.brandSlug) : null,
  ]);

  let categoryIds = null;
  if (category?.id != null) {
    const categories = await listCategories({ all: true, activeOnly: true });
    categoryIds = getCategoryTreeIds(categories, category.id);
  }

  const filters = {
    categoryIds,
    brandId: brand?.id ?? null,
    status: 'ACTIVE',
    search: params.search,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    inStock: Boolean(params.inStock),
  };
  const [products, total] = await Promise.all([
    listProducts({ ...filters, limit, offset: (page - 1) * limit, sort: params.sort, direction: params.direction }),
    countProducts(filters),
  ]);
  return {
    products,
    pagination: {
      page,
      limit,
      total,
      hasMore: page * limit < total,
    },
  };
}

export async function getProductBySlug(slug) {
  if (!slug || typeof slug !== 'string') return null;
  const product = await findProductBySlug(slug.trim().toLowerCase());
  if (!product) return null;
  const [variants, images] = await Promise.all([
    findProductVariants(product.id),
    findProductImages(product.id),
  ]);
  return { ...product, variants, images };
}

export async function getCategories(params = {}) {
  return listCategories({ parentId: params.parentId ?? null, activeOnly: true, all: Boolean(params.all) });
}

export async function getCategoryBySlug(slug) {
  if (!slug || typeof slug !== 'string') return null;
  return findCategoryBySlug(slug.trim().toLowerCase());
}

export async function getBrands(params = {}) {
  return listBrands({ limit: params.limit });
}

export async function getBrandBySlug(slug) {
  if (!slug || typeof slug !== 'string') return null;
  return findBrandBySlug(slug.trim().toLowerCase());
}
