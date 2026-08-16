import { listAdminCustomers } from '../../../../../server/admin/customers.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';
export async function GET(request){try{const p=new URL(request.url).searchParams;return apiSuccess({customers:await listAdminCustomers({search:p.get('search')?.trim()||null,limit:p.get('limit'),offset:p.get('offset')})});}catch(error){return apiErrorResponse(error,'Unable to load customers.');}}
