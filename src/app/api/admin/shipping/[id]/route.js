import { updateAdminShippingMethod } from '../../../../../server/admin/shipping.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function PATCH(request, { params }) { try { const body = await request.json(); return apiSuccess({ shippingMethod: await updateAdminShippingMethod((await params).id, body) }); } catch (error) { return apiErrorResponse(error, 'Unable to update shipping method.'); } }
