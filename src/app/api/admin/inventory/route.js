import { requireRole } from '../../../../../lib/auth/session.js';
import { listAdminInventory } from '../../../../../server/admin/inventory.js';
import { apiErrorResponse, apiSuccess } from '../../../../../server/api/response.js';

export async function GET(request) {
  try {
    await requireRole(['ADMIN', 'SUPER_ADMIN']);
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || null;
    const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);
    const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);
    return apiSuccess({ inventory: await listAdminInventory({ search, limit, offset }) });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to load inventory.');
  }
}
