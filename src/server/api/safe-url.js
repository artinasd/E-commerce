const ALLOWED_SORT_DIRECTIONS = new Set(['asc', 'desc']);

export function parseSortDirection(value, defaultValue = 'asc') {
  const normalized = String(value ?? defaultValue).toLowerCase();
  return ALLOWED_SORT_DIRECTIONS.has(normalized) ? normalized : defaultValue;
}

export function parseCsv(value, { maxItems = 20 } = {}) {
  if (!value) return [];
  return [...new Set(String(value).split(',').map((item) => item.trim()).filter(Boolean))].slice(0, maxItems);
}

export function assertAllowedSort(value, allowedFields, defaultField) {
  const field = String(value ?? defaultField);
  if (!Object.hasOwn(allowedFields, field)) return defaultField;
  return allowedFields[field];
}
