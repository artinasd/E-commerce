import { randomUUID } from 'node:crypto';
import { addProductImage } from '../../../../../../../server/admin/images.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../../server/api/response.js';

export const runtime = 'nodejs';

const MAX_SIZE = 5 * 1024 * 1024;
const EXTENSIONS = new Map([
  ['image/jpeg', '.jpg'], ['image/png', '.png'], ['image/webp', '.webp'], ['image/gif', '.gif'],
]);

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return Response.json({ success: false, message: 'فایل تصویر ارسال نشده است.' }, { status: 400 });
    }
    if (!EXTENSIONS.has(file.type)) {
      return Response.json({ success: false, message: 'فرمت تصویر مجاز نیست. از JPG، PNG، WEBP یا GIF استفاده کنید.' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return Response.json({ success: false, message: 'حداکثر حجم تصویر ۵ مگابایت است.' }, { status: 400 });
    }

    const productId = Number(id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return Response.json({ success: false, message: 'شناسه محصول نامعتبر است.' }, { status: 400 });
    }

    const uuid = randomUUID();
    const image = await addProductImage({
      productId,
      url: `/api/demo-image/product/${productId}?uuid=${uuid}`,
      altText: formData.get('altText') || null,
      sortOrder: Number(formData.get('sortOrder')) || 0,
      isPrimary: formData.get('isPrimary') === 'true',
    });

    return apiSuccess({ image }, { status: 201 });
  } catch (error) {
    console.error('Upload Error:', error);
    return apiErrorResponse(error, 'Unable to upload product image.');
  }
}
