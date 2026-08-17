'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductImageManager from '../../../../components/admin/ProductImageManager.js';

export default function NewProductPage() {
  const [form, setForm] = useState({ name: '', slug: '', shortDescription: '', description: '', categoryId: '', brandId: '', status: 'DRAFT', isFeatured: false });
  const [options, setOptions] = useState({ categories: [], brands: [] });
  const [productId, setProductId] = useState(null);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/catalog/options').then(async (r) => { const j = await r.json(); if (!r.ok) throw new Error(j?.error?.message || 'خطا در دریافت برندها و دسته‌بندی‌ها'); return j.data || {}; }).then(setOptions).catch((e) => setMessage(e.message));
  }, []);

  async function submit(event) {
    event.preventDefault(); setSaving(true); setMessage('');
    try {
      const response = await fetch('/api/admin/products/create', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...form, categoryId: form.categoryId || null, brandId: form.brandId || null }) });
      const json = await response.json();
      if (!response.ok) throw new Error(json?.error?.message || 'خطا در ایجاد محصول');
      const product = json?.data?.product;
      if (!product?.id) throw new Error('محصول ایجاد شد اما شناسه آن از سرور دریافت نشد.');
      setProductId(Number(product.id)); setMessage('محصول ایجاد شد. حالا می‌توانید تصاویر و تنوع‌های آن را مدیریت کنید.');
    } catch (error) { setMessage(error.message); } finally { setSaving(false); }
  }

  return <section dir="rtl" className="max-w-4xl space-y-6">
    <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-slate-500">کاتالوگ</p><h1 className="mt-1 text-3xl font-black">افزودن محصول</h1></div><Link href="/admin/products" className="rounded-xl border bg-white px-4 py-2 text-sm font-bold">بازگشت</Link></div>
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black">اطلاعات اصلی</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">نام محصول<input required disabled={Boolean(productId)} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border px-4 py-3 font-normal disabled:bg-slate-50" /></label>
        <label className="grid gap-2 text-sm font-bold">Slug<input required disabled={Boolean(productId)} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-xl border px-4 py-3 font-normal disabled:bg-slate-50" /></label>
        <label className="grid gap-2 text-sm font-bold">دسته‌بندی<select disabled={Boolean(productId)} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="rounded-xl border px-4 py-3 font-normal disabled:bg-slate-50"><option value="">بدون دسته‌بندی</option>{options.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <label className="grid gap-2 text-sm font-bold">برند<select disabled={Boolean(productId)} value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })} className="rounded-xl border px-4 py-3 font-normal disabled:bg-slate-50"><option value="">بدون برند</option>{options.brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
      </div>
      <label className="grid gap-2 text-sm font-bold">توضیح کوتاه<input disabled={Boolean(productId)} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="rounded-xl border px-4 py-3 font-normal disabled:bg-slate-50" /></label>
      <label className="grid gap-2 text-sm font-bold">توضیحات<textarea disabled={Boolean(productId)} rows="6" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl border px-4 py-3 font-normal disabled:bg-slate-50" /></label>
      <label className="grid gap-2 text-sm font-bold">وضعیت<select disabled={Boolean(productId)} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-xl border px-4 py-3 font-normal disabled:bg-slate-50"><option value="DRAFT">پیش‌نویس</option><option value="ACTIVE">فعال</option><option value="ARCHIVED">بایگانی</option></select></label>
      <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" disabled={Boolean(productId)} checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> محصول ویژه</label>
      {message && <div className="rounded-xl bg-slate-100 p-3 text-sm">{message}</div>}
      {!productId && <button disabled={saving} className="w-fit rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-50">{saving ? 'در حال ذخیره…' : 'ایجاد محصول'}</button>}
      {productId && <Link href={`/admin/products/${productId}`} className="w-fit rounded-xl border px-5 py-3 text-sm font-bold">ویرایش کامل محصول</Link>}
    </form>
    {productId && <ProductImageManager productId={productId} images={images} onChange={setImages} />}
  </section>;
}
