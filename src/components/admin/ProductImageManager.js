'use client';

import { useRef, useState } from 'react';

export default function ProductImageManager({ productId, images = [], onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  async function uploadFiles(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;

    setUploading(true);
    setMessage('');
    try {
      const next = [];
      for (const file of files) {
        if (!file.type.startsWith('image/')) throw new Error('فقط فایل‌های تصویری مجاز هستند.');
        if (file.size > 5 * 1024 * 1024) throw new Error('حداکثر حجم هر تصویر ۵ مگابایت است.');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('isPrimary', String(images.length === 0 && next.length === 0));
        formData.append('sortOrder', String(images.length + next.length));

        const response = await fetch(`/api/admin/products/${productId}/images/upload`, {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result?.error?.message || 'خطا در آپلود تصویر');
        next.push(result.image);
      }

      onChange([...images, ...next]);
      setMessage(`${next.length} تصویر با موفقیت اضافه شد.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function removeImage(imageId) {
    setMessage('');
    try {
      const response = await fetch(`/api/admin/images/${imageId}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message || 'خطا در حذف تصویر');
      onChange(images.filter((image) => image.id !== imageId));
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function setPrimary(image) {
    setMessage('');
    try {
      const response = await fetch(`/api/admin/products/${productId}/images/${image.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ isPrimary: true }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message || 'خطا در انتخاب تصویر اصلی');
      onChange(images.map((item) => ({ ...item, isPrimary: item.id === image.id })));
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function moveImage(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const reordered = [...images];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const normalized = reordered.map((image, sortOrder) => ({ ...image, sortOrder }));
    onChange(normalized);

    try {
      await Promise.all(normalized.map((image) => fetch(`/api/admin/products/${productId}/images/${image.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sortOrder: image.sortOrder }),
      })));
    } catch (error) {
      setMessage(error.message || 'ترتیب تصاویر ذخیره نشد.');
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">تصاویر محصول</h2>
          <p className="mt-1 text-sm text-slate-500">چند تصویر انتخاب کنید، تصویر اصلی را مشخص کنید و ترتیب نمایش را تغییر دهید.</p>
        </div>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-50">
          {uploading ? 'در حال آپلود…' : 'انتخاب تصاویر'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={uploadFiles} className="hidden" />
      </div>

      {message && <p className="mt-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}

      {images.length === 0 ? (
        <button type="button" onClick={() => inputRef.current?.click()} className="mt-5 flex min-h-48 w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm font-bold text-slate-500 hover:border-slate-400">
          هنوز تصویری اضافه نشده — برای انتخاب تصاویر کلیک کنید
        </button>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <article key={image.id} className={`overflow-hidden rounded-2xl border ${image.isPrimary ? 'ring-2 ring-slate-950' : ''}`}>
              <div className="aspect-square bg-slate-100">
                <img src={image.url} alt={image.altText || 'تصویر محصول'} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-3 p-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold">تصویر {index + 1}</span>
                  {image.isPrimary && <span className="rounded-full bg-slate-950 px-2 py-1 font-bold text-white">تصویر اصلی</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {!image.isPrimary && <button type="button" onClick={() => setPrimary(image)} className="rounded-lg border px-3 py-2 text-xs font-bold">انتخاب به‌عنوان اصلی</button>}
                  <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} className="rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-30">←</button>
                  <button type="button" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1} className="rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-30">→</button>
                  <button type="button" onClick={() => removeImage(image.id)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600">حذف</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
