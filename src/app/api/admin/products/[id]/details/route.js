import { getAdminProduct } from '../../../../../../server/admin/catalog.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../server/api/response.js';

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const product = await getAdminProduct(Number(id));
    if (!product) return apiSuccess(null, { status: 404 });
    return apiSuccess(product);
  } catch (error) { return apiErrorResponse(error, 'Unable to load product.'); }
}
