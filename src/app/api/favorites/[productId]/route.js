import { requireUser } from '../../../../lib/auth/session.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';
import { getFavoriteState, toggleFavorite } from '../../../../server/favorites/service.js';

export async function GET(_request, { params }) {
  try {
    const user = await requireUser();
    return apiSuccess({ productId: Number(params.productId), isFavorite: await getFavoriteState(user.id, params.productId) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load favorite state.');
  }
}

export async function POST(_request, { params }) {
  try {
    const user = await requireUser();
    return apiSuccess(await toggleFavorite(user.id, params.productId));
  } catch (error) {
    return apiErrorResponse(error, 'Unable to update favorite.');
  }
}
