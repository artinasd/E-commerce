import { createAdminCategory } from '../../../../../server/admin/catalog.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function POST(request) {
  try {
    const body = await request.json();
    return apiSuccess({ category: await createAdminCategory(body) }, 201);
  } catch (error) {
    return apiErrorResponse(error, 'Unable to create category.');
  }
}
