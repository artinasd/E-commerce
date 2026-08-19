import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { updateAdminBrandLogo } from '../../../../../../../../server/admin/catalog.js';
import { apiErrorResponse, apiSuccess } from '../../../../../../../../server/api/response.js';

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
    const brandId = Number(id);
    if (!Number.isSafeInteger(brandId) || brandId < 1) throw new Error('شناسه برند نامعتبر است.');
    const filename = `${randomUUID()}${EXTENSIONS.get(file.type)}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'catalog', 'brands');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
    const logoUrl = `/uploads/catalog/brands/${filename}`;
    const brand = await updateAdminBrandLogo(brandId, logoUrl);
    return apiSuccess({ brand }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to upload brand image.');
  }
}
