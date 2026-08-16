import { requireUser } from '../../../../../../lib/auth/session.js';
import { setDefaultAddress } from '../../../../../../server/account/service.js';
import { validateAddressId } from '../../../../../../server/account/validation.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../server/api/errors.js';
export async function POST(_request,{params}){try{const user=await requireUser();const {id}=await params;const ok=await setDefaultAddress(user.id,validateAddressId(id));if(!ok)return apiSuccess({address:null},404);return apiSuccess({updated:true});}catch(error){return apiErrorResponse(error,'Unable to set the default address.');}}
