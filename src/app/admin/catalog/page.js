'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const emptyBrand = { name: '', slug: '', description: '', logoUrl: '' };
const emptyCategory = { name: '', slug: '', description: '', imageUrl: '', parentId: '', sortOrder: 0 };
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function validateImage(file) {
  if (!file) return;
  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) throw new Error('فرمت تصویر مجاز نیست. از JPG، PNG، WEBP یا GIF استفاده کنید.');
  if (file.size > MAX_IMAGE_SIZE) throw new Error('حداکثر حجم تصویر ۵ مگابایت است.');
}

export default function AdminCatalogPage() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState(emptyBrand);
  const [category, setCategory] = useState(emptyCategory);
  const [brandFile, setBrandFile] = useState(null);
  const [categoryFile, setCategoryFile] = useState(null);
  const [brandPreview, setBrandPreview] = useState('');
  const [categoryPreview, setCategoryPreview] = useState('');
  const brandInputRef = useRef(null);
  const categoryInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState('');

  useEffect(() => {
    let active = true;
    async function fetchCatalog() {
      try {
        const response = await fetch('/api/admin/catalog/options', { cache: 'no-store' });
        const json = await response.json();
        if (!response.ok) throw new Error(json?.error?.message || 'خطا در دریافت کاتالوگ');
        if (!active) return;
        setBrands(json.data?.brands || []);
        setCategories(json.data?.categories || []);
      } catch (error) { if (active) setMessage(error.message); }
    }
    fetchCatalog();
    return () => { active = false; };
  }, []);

  async function load() {
    const response = await fetch('/api/admin/catalog/options', { cache: 'no-store' });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.error?.message || 'خطا در دریافت کاتالوگ');
    setBrands(json.data?.brands || []);
    setCategories(json.data?.categories || []);
  }

  function selectImage(type, file) {
    try {
      validateImage(file);
      if (type === 'brands') {
        setBrandFile(file || null);
        setBrandPreview(file ? URL.createObjectURL(file) : '');
      } else {
        setCategoryFile(file || null);
        setCategoryPreview(file ? URL.createObjectURL(file) : '');
      }
      setMessage('');
    } catch (error) {
      if (type === 'brands' && brandInputRef.current) brandInputRef.current.value = '';
      if (type === 'categories' && categoryInputRef.current) categoryInputRef.current.value = '';
      setMessage(error.message);
    }
  }

  async function uploadImage(type, id, file) {
    if (!file) return null;
    validateImage(file);
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`/api/admin/catalog/${type}/${id}/image`, { method: 'POST', body: formData });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.error?.message || 'آپلود تصویر انجام نشد');
    return type === 'brands' ? json.data?.brand?.logo_url : json.data?.category?.image_url;
  }

  async function create(type, data, file) {
    setSaving(type); setMessage('');
    try {
      const response = await fetch(`/api/admin/catalog/${type}`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.error?.message || 'ذخیره انجام نشد');
      const created = type === 'brands' ? json.data?.brand : json.data?.category;
      if (!created?.id) throw new Error('رکورد ایجاد شد اما شناسه آن از سرور دریافت نشد.');
      if (file) await uploadImage(type, created.id, file);
      setMessage(type === 'brands' ? 'برند با موفقیت ایجاد شد.' : 'دسته‌بندی با موفقیت ایجاد شد.');
      if (type === 'brands') {
        setBrand(emptyBrand); setBrandFile(null); setBrandPreview('');
        if (brandInputRef.current) brandInputRef.current.value = '';
      } else {
        setCategory(emptyCategory); setCategoryFile(null); setCategoryPreview('');
        if (categoryInputRef.current) categoryInputRef.current.value = '';
      }
      await load();
    } catch (error) {
      setMessage(error.message);
    } finally { setSaving(''); }
  }

  return <section dir="rtl" className="space-y-6">
    <div className="flex items-end justify-between gap-4">
      <div><p className="text-sm font-semibold text-slate-500">کاتالوگ</p><h1 className="mt-1 text-3xl font-black">برندها و دسته‌بندی‌ها</h1><p className="mt-2 text-sm text-slate-500">مدیریت مستقیم ساختار کاتالوگ فروشگاه.</p></div>
      <Link href="/admin/products" className="rounded-xl border bg-white px-4 py-2 text-sm font-bold">محصولات</Link>
    </div>

    {message && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">{message}</div>}

    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={(e) => { e.preventDefault(); create('brands', brand, brandFile); }} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <div><h2 className="text-xl font-black">افزودن برند</h2><p className="mt-1 text-xs text-slate-500">برند جدید برای انتخاب هنگام ساخت محصول.</p></div>
        <label className="grid gap-2 text-sm font-bold">نام برند<input required value={brand.name} onChange={(e) => setBrand({ ...brand, name: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" placeholder="مثلاً سامسونگ" /></label>
        <label className="grid gap-2 text-sm font-bold">Slug <span className="font-normal text-slate-400">اختیاری</span><input value={brand.slug} onChange={(e) => setBrand({ ...brand, slug: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" placeholder="samsung" /></label>
        <label className="grid gap-2 text-sm font-bold">توضیحات<textarea rows="3" value={brand.description} onChange={(e) => setBrand({ ...brand, description: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" /></label>
        <div className="grid gap-3">
          <label className="text-sm font-bold">لوگوی برند <span className="font-normal text-slate-400">اختیاری · JPG, PNG, WEBP, GIF · حداکثر ۵MB</span></label>
          <div className="flex items-center gap-4 rounded-xl border border-dashed p-4">
            {brandPreview && <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50"><Image src={brandPreview} alt="پیش‌نمایش لوگو" fill sizes="64px" unoptimized className="object-contain" /></div>}
            <button type="button" onClick={() => brandInputRef.current?.click()} className="rounded-xl border px-4 py-3 text-sm font-bold">{brandFile ? 'تغییر تصویر' : 'انتخاب تصویر'}</button>
            {brandFile && <span className="min-w-0 truncate text-xs text-slate-500">{brandFile.name}</span>}
            <input ref={brandInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => selectImage('brands', e.target.files?.[0])} className="hidden" />
          </div>
          <details><summary className="cursor-pointer text-xs font-semibold text-slate-400">یا استفاده از آدرس تصویر موجود</summary><input value={brand.logoUrl} onChange={(e) => setBrand({ ...brand, logoUrl: e.target.value })} className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-normal" placeholder="https://..." /></details>
        </div>
        <button disabled={saving === 'brands'} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving === 'brands' ? 'در حال ذخیره…' : 'ایجاد برند'}</button>
      </form>

      <form onSubmit={(e) => { e.preventDefault(); create('categories', category, categoryFile); }} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <div><h2 className="text-xl font-black">افزودن دسته‌بندی</h2><p className="mt-1 text-xs text-slate-500">دسته‌بندی جدید برای سازمان‌دهی محصولات.</p></div>
        <label className="grid gap-2 text-sm font-bold">نام دسته‌بندی<input required value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" placeholder="مثلاً موبایل" /></label>
        <label className="grid gap-2 text-sm font-bold">Slug <span className="font-normal text-slate-400">اختیاری</span><input value={category.slug} onChange={(e) => setCategory({ ...category, slug: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" placeholder="mobile" /></label>
        <label className="grid gap-2 text-sm font-bold">دسته‌بندی والد <span className="font-normal text-slate-400">اختیاری</span><select value={category.parentId} onChange={(e) => setCategory({ ...category, parentId: e.target.value })} className="rounded-xl border px-4 py-3 font-normal"><option value="">بدون والد</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-bold">توضیحات<textarea rows="3" value={category.description} onChange={(e) => setCategory({ ...category, description: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" /></label>
        <div className="grid gap-3">
          <label className="text-sm font-bold">تصویر دسته‌بندی <span className="font-normal text-slate-400">اختیاری · JPG, PNG, WEBP, GIF · حداکثر ۵MB</span></label>
          <div className="flex items-center gap-4 rounded-xl border border-dashed p-4">
            {categoryPreview && <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-50"><Image src={categoryPreview} alt="پیش‌نمایش دسته‌بندی" fill sizes="64px" unoptimized className="object-cover" /></div>}
            <button type="button" onClick={() => categoryInputRef.current?.click()} className="rounded-xl border px-4 py-3 text-sm font-bold">{categoryFile ? 'تغییر تصویر' : 'انتخاب تصویر'}</button>
            {categoryFile && <span className="min-w-0 truncate text-xs text-slate-500">{categoryFile.name}</span>}
            <input ref={categoryInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => selectImage('categories', e.target.files?.[0])} className="hidden" />
          </div>
          <details><summary className="cursor-pointer text-xs font-semibold text-slate-400">یا استفاده از آدرس تصویر موجود</summary><input value={category.imageUrl} onChange={(e) => setCategory({ ...category, imageUrl: e.target.value })} className="mt-2 w-full rounded-xl border px-4 py-3 text-sm font-normal" placeholder="https://..." /></details>
        </div>
        <label className="grid gap-2 text-sm font-bold">ترتیب<input type="number" value={category.sortOrder} onChange={(e) => setCategory({ ...category, sortOrder: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" /></label>
        <button disabled={saving === 'categories'} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving === 'categories' ? 'در حال ذخیره…' : 'ایجاد دسته‌بندی'}</button>
      </form>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="text-lg font-black">برندهای موجود ({brands.length.toLocaleString('fa-IR')})</h2><div className="mt-4 divide-y">{brands.map((item) => <div key={item.id} className="flex items-center gap-3 py-3">{item.logo_url && <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-50"><Image src={item.logo_url} alt="" fill sizes="40px" unoptimized className="object-contain" /></div>}<span className="font-bold">{item.name}</span><Link href={`/admin/catalog/edit?type=brand&id=${item.id}`} className="mr-auto rounded-lg border px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">ویرایش</Link><span className="text-xs text-slate-400">{item.slug}</span></div>)}{!brands.length && <p className="py-6 text-sm text-slate-500">هنوز برندی ایجاد نشده است.</p>}</div></div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="text-lg font-black">دسته‌بندی‌های موجود ({categories.length.toLocaleString('fa-IR')})</h2><div className="mt-4 divide-y">{categories.map((item) => <div key={item.id} className="flex items-center gap-3 py-3">{item.image_url && <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-50"><Image src={item.image_url} alt="" fill sizes="40px" unoptimized className="object-cover" /></div>}<span className="font-bold">{item.name}</span><Link href={`/admin/catalog/edit?type=category&id=${item.id}`} className="mr-auto rounded-lg border px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">ویرایش</Link><span className="text-xs text-slate-400">{item.slug}</span></div>)}{!categories.length && <p className="py-6 text-sm text-slate-500">هنوز دسته‌بندی ایجاد نشده است.</p>}</div></div>
    </div>
  </section>;
}
