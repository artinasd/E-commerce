'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const emptyBrand = { name: '', slug: '', description: '', logoUrl: '' };
const emptyCategory = { name: '', slug: '', description: '', imageUrl: '', parentId: '', sortOrder: 0 };

export default function AdminCatalogPage() {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState(emptyBrand);
  const [category, setCategory] = useState(emptyCategory);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState('');

  async function load() {
    const response = await fetch('/api/admin/catalog/options', { cache: 'no-store' });
    const json = await response.json();
    if (!response.ok) throw new Error(json?.error?.message || 'خطا در دریافت کاتالوگ');
    setBrands(json.data?.brands || []);
    setCategories(json.data?.categories || []);
  }

  useEffect(() => { load().catch((error) => setMessage(error.message)); }, []);

  async function create(type, data) {
    setSaving(type); setMessage('');
    try {
      const response = await fetch(`/api/admin/catalog/${type}`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.error?.message || 'ذخیره انجام نشد');
      setMessage(type === 'brands' ? 'برند با موفقیت ایجاد شد.' : 'دسته‌بندی با موفقیت ایجاد شد.');
      if (type === 'brands') setBrand(emptyBrand); else setCategory(emptyCategory);
      await load();
    } catch (error) { setMessage(error.message); } finally { setSaving(''); }
  }

  return <section dir="rtl" className="space-y-6">
    <div className="flex items-end justify-between gap-4">
      <div><p className="text-sm font-semibold text-slate-500">کاتالوگ</p><h1 className="mt-1 text-3xl font-black">برندها و دسته‌بندی‌ها</h1><p className="mt-2 text-sm text-slate-500">مدیریت مستقیم ساختار کاتالوگ فروشگاه.</p></div>
      <Link href="/admin/products" className="rounded-xl border bg-white px-4 py-2 text-sm font-bold">محصولات</Link>
    </div>

    {message && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">{message}</div>}

    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={(e) => { e.preventDefault(); create('brands', brand); }} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <div><h2 className="text-xl font-black">افزودن برند</h2><p className="mt-1 text-xs text-slate-500">برند جدید برای انتخاب هنگام ساخت محصول.</p></div>
        <label className="grid gap-2 text-sm font-bold">نام برند<input required value={brand.name} onChange={(e) => setBrand({ ...brand, name: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" placeholder="مثلاً سامسونگ" /></label>
        <label className="grid gap-2 text-sm font-bold">Slug <span className="font-normal text-slate-400">اختیاری</span><input value={brand.slug} onChange={(e) => setBrand({ ...brand, slug: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" placeholder="samsung" /></label>
        <label className="grid gap-2 text-sm font-bold">توضیحات<textarea rows="3" value={brand.description} onChange={(e) => setBrand({ ...brand, description: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" /></label>
        <label className="grid gap-2 text-sm font-bold">آدرس لوگو <span className="font-normal text-slate-400">اختیاری</span><input value={brand.logoUrl} onChange={(e) => setBrand({ ...brand, logoUrl: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" placeholder="https://..." /></label>
        <button disabled={saving === 'brands'} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving === 'brands' ? 'در حال ذخیره…' : 'ایجاد برند'}</button>
      </form>

      <form onSubmit={(e) => { e.preventDefault(); create('categories', category); }} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <div><h2 className="text-xl font-black">افزودن دسته‌بندی</h2><p className="mt-1 text-xs text-slate-500">دسته‌بندی جدید برای سازمان‌دهی محصولات.</p></div>
        <label className="grid gap-2 text-sm font-bold">نام دسته‌بندی<input required value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" placeholder="مثلاً موبایل" /></label>
        <label className="grid gap-2 text-sm font-bold">Slug <span className="font-normal text-slate-400">اختیاری</span><input value={category.slug} onChange={(e) => setCategory({ ...category, slug: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" placeholder="mobile" /></label>
        <label className="grid gap-2 text-sm font-bold">دسته‌بندی والد <span className="font-normal text-slate-400">اختیاری</span><select value={category.parentId} onChange={(e) => setCategory({ ...category, parentId: e.target.value })} className="rounded-xl border px-4 py-3 font-normal"><option value="">بدون والد</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-bold">توضیحات<textarea rows="3" value={category.description} onChange={(e) => setCategory({ ...category, description: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" /></label>
        <div className="grid grid-cols-2 gap-3"><label className="grid gap-2 text-sm font-bold">آدرس تصویر<input value={category.imageUrl} onChange={(e) => setCategory({ ...category, imageUrl: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" /></label><label className="grid gap-2 text-sm font-bold">ترتیب<input type="number" value={category.sortOrder} onChange={(e) => setCategory({ ...category, sortOrder: e.target.value })} className="rounded-xl border px-4 py-3 font-normal" /></label></div>
        <button disabled={saving === 'categories'} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving === 'categories' ? 'در حال ذخیره…' : 'ایجاد دسته‌بندی'}</button>
      </form>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="text-lg font-black">برندهای موجود ({brands.length.toLocaleString('fa-IR')})</h2><div className="mt-4 divide-y">{brands.map((item) => <div key={item.id} className="flex items-center justify-between py-3"><span className="font-bold">{item.name}</span><span className="text-xs text-slate-400">{item.slug}</span></div>)}{!brands.length && <p className="py-6 text-sm text-slate-500">هنوز برندی ایجاد نشده است.</p>}</div></div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="text-lg font-black">دسته‌بندی‌های موجود ({categories.length.toLocaleString('fa-IR')})</h2><div className="mt-4 divide-y">{categories.map((item) => <div key={item.id} className="flex items-center justify-between py-3"><span className="font-bold">{item.name}</span><span className="text-xs text-slate-400">{item.slug}</span></div>)}{!categories.length && <p className="py-6 text-sm text-slate-500">هنوز دسته‌بندی ایجاد نشده است.</p>}</div></div>
    </div>
  </section>;
}
