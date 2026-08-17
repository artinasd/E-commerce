import { createVariant } from '../../../../../../server/admin/variants.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../server/api/response.js';

export async function POST(request, { params }) {
  try {
    const body = await request.json();
    const variant = await createVariant({ productId: Number(params.id), sku: body.sku, name: body.name, price: body.price, compareAtPrice: body.compareAtPrice, quantity: body.quantity, lowStockThreshold: body.lowStockThreshold });
    return apiSuccess({ variant }, 201);
  } catch (error) { return apiErrorResponse(error, 'Unable to create variant.'); }
}
