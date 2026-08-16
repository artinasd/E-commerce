import { getAdminCustomer, setCustomerActive } from '../../../../../../server/admin/customers.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../server/api/response.js';
export async function GET(_request,{params}){try{return apiSuccess(await getAdminCustomer(Number(params.id)));}catch(error){return apiErrorResponse(error,'Unable to load customer.');}}
export async function PATCH(request,{params}){try{const body=await request.json();return apiSuccess({customer:await setCustomerActive(Number(params.id),Boolean(body.isActive))});}catch(error){return apiErrorResponse(error,'Unable to update customer.');}}
