import { listAdminProducts } from '../../../../server/admin/products.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    return apiSuccess({ products: await listAdminProducts({ search: searchParams.get('search')?.trim() || null, limit: searchParams.get('limit'), offset: searchParams.get('offset') }) });
  } catch (error) { return apiErrorResponse(error, 'Unable to load products.'); }
}
