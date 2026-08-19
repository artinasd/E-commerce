import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { updateAdminCategoryImage } from '../../../../../../../server/admin/catalog.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../../server/api/response.js';

export const runtime = 'nodejs';

const MAX_SIZE = 5 * 1024 * 1024;
const EXTENSIONS = new Map([['image/jpeg', '.jpg'], ['image/png', '.png'], ['image/webp', '.webp'], ['image/gif', '.gif']]);

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) throw new Error('فایل تصویر ارسال نشده است.');
    if (!EXTENSIONS.has(file.type)) throw new Error('فرمت تصویر مجاز نیست. از JPG، PNG، WEBP یا GIF استفاده کنید.');
    if (file.size > MAX_SIZE) throw new Error('حداکثر حجم تصویر ۵ مگابایت است.');
    const categoryId = Number(id);
    if (!Number.isSafeInteger(categoryId) || categoryId < 1) throw new Error('شناسه دسته‌بندی نامعتبر است.');
    const filename = `${randomUUID()}${EXTENSIONS.get(file.type)}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'catalog', 'categories');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
    const imageUrl = `/uploads/catalog/categories/${filename}`;
    const category = await updateAdminCategoryImage(categoryId, imageUrl);
    return apiSuccess({ category }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to upload category image.');
  }
}
