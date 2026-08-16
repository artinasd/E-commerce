import { getAdminProduct } from '../../../../../../../server/admin/catalog.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../../server/api/response.js';

export async function GET(_request, { params }) {
  try { return apiSuccess(await getAdminProduct(Number(params.id))); }
  catch (error) { return apiErrorResponse(error, 'Unable to load product.'); }
}
