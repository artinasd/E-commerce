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

export async function getProducts(params = {}) {
  const page = Math.max(Number(params.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params.limit) || 24, 1), 100);
  const [category, brand] = await Promise.all([
    params.categorySlug ? findCategoryBySlug(params.categorySlug) : null,
    params.brandSlug ? findBrandBySlug(params.brandSlug) : null,
  ]);
  const filters = {
    categoryId: category?.id ?? null,
    brandId: brand?.id ?? null,
    status: 'ACTIVE',
    search: params.search,
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
  return listCategories({ parentId: params.parentId ?? null, activeOnly: true });
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
