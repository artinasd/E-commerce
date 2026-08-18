import { createAdminBrand } from '../../../../../server/admin/catalog.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function POST(request) {
  try {
    const body = await request.json();
    return apiSuccess({ brand: await createAdminBrand(body) }, 201);
  } catch (error) {
    return apiErrorResponse(error, 'Unable to create brand.');
  }
}
