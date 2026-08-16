import { listAdminOrders } from '../../../../../server/admin/orders.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';
export async function GET(request) { try { const p=new URL(request.url).searchParams; return apiSuccess({orders:await listAdminOrders({search:p.get('search')?.trim()||null,status:p.get('status')||null,limit:p.get('limit'),offset:p.get('offset')})}); } catch(error){ return apiErrorResponse(error,'Unable to load orders.'); } }
