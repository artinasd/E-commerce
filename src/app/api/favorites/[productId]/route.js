import { requireUser } from '../../../../lib/auth/session.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/response.js';
import { getFavoriteState, toggleFavorite } from '../../../../server/favorites/service.js';

export async function GET(_request, context) {
  try {
    const { productId } = await context.params;
    const user = await requireUser();
    return apiSuccess({ productId: Number(productId), isFavorite: await getFavoriteState(user.id, productId) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load favorite state.');
  }
}

export async function POST(_request, context) {
  try {
    const { productId } = await context.params;
    const user = await requireUser();
    return apiSuccess(await toggleFavorite(user.id, productId));
  } catch (error) {
    return apiErrorResponse(error, 'Unable to update favorite.');
  }
}
