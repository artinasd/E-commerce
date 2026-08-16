const SORT_FIELDS = new Set(['created_at', 'price', 'name']);
const SORT_DIRECTIONS = new Set(['asc', 'desc']);

function positiveInt(value, fallback, max) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number) || number < 1) return fallback;
  return Math.min(number, max);
}

export function parseProductQuery(searchParams) {
  const page = positiveInt(searchParams.get('page'), 1, 1000000);
  const limit = positiveInt(searchParams.get('limit'), 24, 100);
  const search = searchParams.get('search')?.trim().slice(0, 120) || undefined;
  const categorySlug = searchParams.get('category')?.trim().toLowerCase().slice(0, 160) || undefined;
  const brandSlug = searchParams.get('brand')?.trim().toLowerCase().slice(0, 160) || undefined;
  const requestedSort = searchParams.get('sort')?.trim().toLowerCase();
  const requestedDirection = searchParams.get('direction')?.trim().toLowerCase();

  return {
    page,
    limit,
    search,
    categorySlug,
    brandSlug,
    sort: SORT_FIELDS.has(requestedSort) ? requestedSort : 'created_at',
    direction: SORT_DIRECTIONS.has(requestedDirection) ? requestedDirection : 'desc',
  };
}

export function parseCollectionQuery(searchParams) {
  return {
    page: positiveInt(searchParams.get('page'), 1, 1000000),
    limit: positiveInt(searchParams.get('limit'), 50, 100),
  };
}
