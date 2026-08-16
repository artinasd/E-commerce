import { getBrands } from '../../../server/catalog/service.js';
import { parseCollectionQuery } from '../../../server/catalog/validation.js';
import { apiErrorResponse, apiSuccess } from '../../../server/api/response.js';

export async function GET(request) {
  try {
    const params = parseCollectionQuery(new URL(request.url).searchParams);
    return apiSuccess(await getBrands(params));
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load brands.');
  }
}
