import {
  listProducts,
  findProductBySlug,
  findProductVariants,
  findProductImages,
  listCategories,
  findCategoryBySlug,
  listBrands,
  findBrandBySlug,
} from '../db/repositories/catalog.js';

export async function getProducts(params = {}) {
  return listProducts({
    page: params.page,
    limit: params.limit,
    search: params.search,
    categorySlug: params.categorySlug,
    brandSlug: params.brandSlug,
    sort: params.sort,
    direction: params.direction,
  });
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
  return listCategories({ page: params.page, limit: params.limit });
}

export async function getCategoryBySlug(slug) {
  if (!slug || typeof slug !== 'string') return null;
  return findCategoryBySlug(slug.trim().toLowerCase());
}

export async function getBrands(params = {}) {
  return listBrands({ page: params.page, limit: params.limit });
}

export async function getBrandBySlug(slug) {
  if (!slug || typeof slug !== 'string') return null;
  return findBrandBySlug(slug.trim().toLowerCase());
}
