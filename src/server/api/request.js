import { ApiError } from './errors.js';

export async function readJson(request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw ApiError.badRequest('Request body must be a JSON object.');
    }
    return body;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw ApiError.badRequest('Invalid JSON request body.');
  }
}

export function getPositiveInteger(value, name, { defaultValue = null, max = 1000000 } = {}) {
  if (value === undefined || value === null || value === '') return defaultValue;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > max) {
    throw ApiError.badRequest(`${name} must be a positive integer.`);
  }
  return parsed;
}

export function getPagination(searchParams, { defaultPageSize = 20, maxPageSize = 100 } = {}) {
  const page = getPositiveInteger(searchParams.get('page'), 'page', { defaultValue: 1 });
  const pageSize = getPositiveInteger(searchParams.get('pageSize'), 'pageSize', {
    defaultValue: defaultPageSize,
    max: maxPageSize,
  });

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
}

export function paginationMeta({ page, pageSize, total }) {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
    hasNextPage: page * pageSize < total,
    hasPreviousPage: page > 1,
  };
}
