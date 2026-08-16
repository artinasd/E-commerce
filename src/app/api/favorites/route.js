import { requireUser } from '../../../lib/auth/session.js';
import { apiErrorResponse, apiSuccess } from '../../../server/api/response.js';
import { getUserFavorites } from '../../../server/favorites/service.js';

export async function GET() {
  try {
    const user = await requireUser();
    return apiSuccess({ favorites: await getUserFavorites(user.id) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load favorites.');
  }
}
