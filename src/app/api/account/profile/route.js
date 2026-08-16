import { requireUser } from '../../../../lib/auth/session.js';
import { getProfile, updateProfile } from '../../../../server/account/service.js';
import { validateProfileInput } from '../../../../server/account/validation.js';
import { apiErrorResponse, apiSuccess } from '../../../../server/api/errors.js';

export async function GET() {
  try {
    const user = await requireUser();
    const profile = await getProfile(user.id);
    if (!profile) return apiSuccess({ profile: null }, 404);
    return apiSuccess({ profile });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load your profile.');
  }
}

export async function PATCH(request) {
  try {
    const user = await requireUser();
    const body = await request.json();
    const profile = validateProfileInput(body);
    const updated = await updateProfile(user.id, profile);
    if (!updated) return apiSuccess({ profile: null }, 404);
    return apiSuccess({ profile: updated });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to update your profile.');
  }
}
