import { getAdminOrder, setAdminOrderStatus } from '../../../../../../server/admin/orders.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../server/api/response.js';
export async function GET(_request,{params}){try{return apiSuccess(await getAdminOrder(Number(params.id)));}catch(error){return apiErrorResponse(error,'Unable to load order.');}}
export async function PATCH(request,{params}){try{const body=await request.json();return apiSuccess({order:await setAdminOrderStatus(Number(params.id),body.status)});}catch(error){return apiErrorResponse(error,'Unable to update order.');}}
