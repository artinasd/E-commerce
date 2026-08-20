'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function validateImage(file) {
  if (!file) return;
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) throw new Error('فرمت تصویر مجاز نیست. از JPG، PNG، WEBP یا GIF استفاده کنید.');
  if (file.size > MAX_IMAGE_SIZE) throw new Error('حداکثر حجم تصویر ۵ مگابایت است.');
}

export default function EditCatalogPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') === 'category' ? 'category' : 'brand';
  const id = searchParams.get('id');
  const inputRef = useRef(null);
  const [item, setItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        if (!id) throw new Error('شناسه مورد برای ویرایش مشخص نشده است.');
        const response = await fetch('/api/admin/catalog/options', { cache: 'no-store' });
        const json = await response.json();
        if (!response.ok) throw new Error(json?.error?.message || 'خطا در دریافت کاتالوگ');
        const list = type === 'brand' ? (json.data?.brands || []) : (json.data?.categories || []);
        const found = list.find((entry) => String(entry.id) === String(id));
        if (!found) throw new Error('مورد موردنظر پیدا نشد.');
        if (!active) return;
        setCategories(json.data?.categories || []);
        setItem(type === 'brand' ? {
          name: found.name || '', slug: found.slug || '', description: found.description || '', logoUrl: found.logo_url || '', isActive: Boolean(found.is_active),
        } : {
          name: found.name || '', slug: found.slug || '', description: found.description || '', imageUrl: found.image_url || '', parentId: found.parent_id ?? '', isActive: Boolean(found.is_active), sortOrder: found.sort_order ?? 0,
        });
      } catch (error) { if (active) setMessage(error.message); }
    }
    load();
    return () => { active = false; };
  }, [id, type]);

  function selectImage(nextFile) {
    try {
      validateImage(nextFile);
      setFile(nextFile || null);
      setPreview(nextFile ? URL.createObjectURL(nextFile) : '');
      setMessage('');
    } catch (error) {
      if (inputRef.current) inputRef.current.value = '';
      setMessage(error.message);
    }
  }

  async function uploadImage(nextId) {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`/api/admin/catalog/${type === 'brand' ? 'brands' : 'categories'}/${nextId}/image`, { method: 'POST', body: formData });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.error?.message || 'آپلود تصویر انجام نشد');
  }

  async function save(event) {
    event.preventDefault();
    if (!item) return;
    setSaving(true); setMessage('');
    try {
      const endpoint = `/api/admin/catalog/${type === 'brand' ? 'brands' : 'categories'}/${id}`;
      const body = type === 'brand' ? item : { ...item, sortOrder: Number(item.sortOrder) };
      const response = await fetch(endpoint, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.error?.message || 'ذخیره انجام نشد');
      if (file) await uploadImage(id);
      setMessage(type === 'brand' ? 'برند با موفقیت ویرایش شد.' : 'دسته‌بندی با موفقیت ویرایش شد.');
      setFile(null); setPreview('');
      if (inputRef.current) inputRef.current.value = '';
    } catch (error) {
      setMessage(error.message);
    } finally { setSaving(false); }
  }

  const currentImage = preview || (type === 'brand' ? item?.logoUrl : item?.imageUrl);

  return <section dir="rtl" className="mx-auto max-w-3xl space-y-6">
    <div className="flex items-center justify-between gap-4">
      <div><Link href="/admin/catalog" className="text-sm font-bold text-slate-500">← بازگشت به کاتالوگ</Link><h1 className="mt-3 text-3xl font-black">ویرایش {type === 'brand' ? 'برند' : 'دسته‌بندی'}</h1></div>
    </div>
    {message && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">{message}</div>}
    {!item && !message && <div className="rounded-2xl border bg-white p-8 text-center font-bold text-slate-500">در حال دریافت اطلاعات…</div>}
    {item && <form onSubmit={save} className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm">
      <label className="grid gap-2 text-sm font-bold">نام {type === 'brand' ? 'برند' : 'دسته‌بندی'}<input required value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" /></label>
      <label className="grid gap-2 text-sm font-bold">Slug<input value={item.slug} onChange={(e) => setItem({ ...item, slug: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" /></label>
      {type === 'category' && <label className="grid gap-2 text-sm font-bold">دسته‌بندی والد<select value={item.parentId ?? ''} onChange={(e) => setItem({ ...item, parentId: e.target.value })} className="rounded-xl border px-4 py-3 font-normal"><option value="">بدون والد</option>{categories.filter((entry) => String(entry.id) !== String(id)).map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}</select></label>}
      <label className="grid gap-2 text-sm font-bold">توضیحات<textarea rows="5" value={item.description} onChange={(e) => setItem({ ...item, description: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" /></label>
      {type === 'category' && <label className="grid gap-2 text-sm font-bold">ترتیب<input type="number" value={item.sortOrder} onChange={(e) => setItem({ ...item, sortOrder: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" /></label>}
      <label className="flex items-center gap-3 rounded-xl border p-4 text-sm font-bold"><input type="checkbox" checked={item.isActive} onChange={(e) => setItem({ ...item, isActive: e.target.checked })} className="h-5 w-5" />فعال</label>
      <div className="grid gap-3"><p className="text-sm font-bold">{type === 'brand' ? 'لوگوی برند' : 'تصویر دسته‌بندی'} <span className="font-normal text-slate-400">اختیاری · JPG, PNG, WEBP, GIF · حداکثر ۵MB</span></p><div className="flex flex-wrap items-center gap-4 rounded-xl border border-dashed p-4">{currentImage && <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50"><Image src={currentImage} alt="" fill sizes="96px" unoptimized className={type === 'brand' ? 'object-contain' : 'object-cover'} /></div>}<button type="button" onClick={() => inputRef.current?.click()} className="rounded-xl border px-4 py-3 text-sm font-bold">{file ? 'تغییر تصویر' : 'انتخاب تصویر جدید'}</button>{file && <span className="max-w-xs truncate text-xs text-slate-500">{file.name}</span>}<input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => selectImage(e.target.files?.[0])} className="hidden" /></div></div>
      <details><summary className="cursor-pointer text-xs font-semibold text-slate-400">یا ویرایش آدرس تصویر موجود</summary><input value={type === 'brand' ? item.logoUrl : item.imageUrl} onChange={(e) => setItem({ ...item, [type === 'brand' ? 'logoUrl' : 'imageUrl']: e.target.value })} className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-normal" placeholder="https://..." /></details>
      <div className="flex justify-end gap-3"><Link href="/admin/catalog" className="rounded-xl border px-5 py-3 text-sm font-bold">انصراف</Link><button disabled={saving} className="rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? 'در حال ذخیره…' : 'ذخیره تغییرات'}</button></div>
    </form>}
  </section>;
}
