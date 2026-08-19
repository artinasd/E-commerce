import { listAdminShippingMethods } from '../../../../server/admin/shipping.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';

export async function GET() { try { return apiSuccess({ shippingMethods: await listAdminShippingMethods() }); } catch (error) { return apiErrorResponse(error, 'Unable to load shipping methods.'); } }
