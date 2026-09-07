import { updateAdminCategoryImage } from '../../../../../../../server/admin/catalog.js';
import { apiSuccess } from '../../../../../../../server/api/response.js';

export const runtime = 'nodejs';

const MAX_SIZE = 5 * 1024 * 1024;
const EXTENSIONS = new Map([['image/jpeg', '.jpg'], ['image/png', '.png'], ['image/webp', '.webp'], ['image/gif', '.gif']]);

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
    const categoryId = Number(id);
    if (!Number.isSafeInteger(categoryId) || categoryId < 1) {
      return Response.json({ success: false, message: 'شناسه دسته‌بندی نامعتبر است.' }, { status: 400 });
    }

    // Instead of writing to disk, generate a deterministic SVG mock URL
    const imageUrl = `/api/demo-image/category/${categoryId}`;
    const category = await updateAdminCategoryImage(categoryId, imageUrl);
    return apiSuccess({ category }, 201);
  } catch (error) {
    console.error('Upload Error:', error);
    return Response.json({ success: false, message: 'Unable to upload category image.' }, { status: 500 });
  }
}
