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
    if (!(file instanceof File)) throw new Error('فایل تصویر ارسال نشده است.');
    if (!EXTENSIONS.has(file.type)) throw new Error('فرمت تصویر مجاز نیست. از JPG، PNG، WEBP یا GIF استفاده کنید.');
    if (file.size > MAX_SIZE) throw new Error('حداکثر حجم تصویر ۵ مگابایت است.');

    const productId = Number(id);
    if (!Number.isInteger(productId) || productId <= 0) throw new Error('شناسه محصول نامعتبر است.');

    // Demo/Vercel mode: never write uploaded files to the ephemeral filesystem.
    // The selected file is validated for a realistic admin experience, but a
    // deterministic local SVG is used as the persisted image URL instead.
    const imageUrl = `${new URL(request.url).origin}/api/demo-image/product/${productId}`;

    const image = await addProductImage({
      productId,
      url: imageUrl,
      altText: formData.get('altText') || null,
      sortOrder: Number(formData.get('sortOrder')) || 0,
      isPrimary: formData.get('isPrimary') === 'true',
    });

    return apiSuccess({ image }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to upload product image.');
  }
}
