import { updateAdminBrand } from '../../../../../../../server/admin/catalog.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../../server/api/response.js';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    return apiSuccess({ brand: await updateAdminBrand(id, body) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to update brand.');
  }
}
