import { listAdminCategories, listAdminBrands } from '../../../../../server/admin/catalog.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function GET() {
  try { const [categories, brands] = await Promise.all([listAdminCategories(), listAdminBrands()]); return apiSuccess({ categories, brands }); }
  catch (error) { return apiErrorResponse(error, 'Unable to load catalog options.'); }
}
