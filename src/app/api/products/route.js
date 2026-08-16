import { getProducts } from '../../../server/catalog/service.js';
import { parseProductQuery } from '../../../server/catalog/validation.js';
import { apiErrorResponse, apiSuccess } from '../../../server/api/response.js';

export async function GET(request) {
  try {
    const params = parseProductQuery(new URL(request.url).searchParams);
    const result = await getProducts(params);
    return apiSuccess(result);
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load products.');
  }
}
