import { createVariant, updateVariant } from '../../../../../../server/admin/variants.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../server/api/response.js';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const productId = Number(id);
    if (!Number.isSafeInteger(productId) || productId <= 0) return apiErrorResponse(new Error('Invalid product id.'), 'Unable to create variant.');
    const body = await request.json();
    return apiSuccess({ variant: await createVariant({ productId, sku: body.sku, name: body.name, price: body.price, compareAtPrice: body.compareAtPrice, quantity: body.quantity, lowStockThreshold: body.lowStockThreshold }) }, 201);
  } catch (error) { return apiErrorResponse(error, 'Unable to create variant.'); }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const variantId = Number(id);
    if (!Number.isSafeInteger(variantId) || variantId <= 0) return apiErrorResponse(new Error('Invalid variant id.'), 'Unable to update variant.');
    const body = await request.json();
    return apiSuccess({ variant: await updateVariant(variantId, body) });
  } catch (error) { return apiErrorResponse(error, 'Unable to update variant.'); }
}
