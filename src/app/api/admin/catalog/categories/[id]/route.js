import { updateAdminCategory } from '../../../../../../server/admin/catalog.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../server/api/response.js';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    return apiSuccess({ category: await updateAdminCategory(id, body) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to update category.');
  }
}
