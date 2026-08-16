'use client';

import { useState } from 'react';

export default function NewProductPage() {
  const [form, setForm] = useState({ name: '', slug: '', shortDescription: '', description: '', status: 'DRAFT', isFeatured: false });
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault(); setSaving(true); setMessage('');
    try {
      const response = await fetch('/api/admin/products/create', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || 'خطا در ایجاد محصول');
      setMessage(`محصول با شناسه ${data.product.id} ایجاد شد.`);
      setForm({ name: '', slug: '', shortDescription: '', description: '', status: 'DRAFT', isFeatured: false });
    } catch (error) { setMessage(error.message); } finally { setSaving(false); }
  }

  return <section dir="rtl" className="max-w-3xl"><div className="mb-6"><p className="text-sm font-semibold text-slate-500">کاتالوگ</p><h1 className="mt-1 text-3xl font-black">افزودن محصول</h1></div><form onSubmit={submit} className="grid gap-4 rounded-2xl border bg-white p-6 shadow-sm"><label className="grid gap-2 text-sm font-bold">نام محصول<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="rounded-xl border px-4 py-3 font-normal outline-none focus:ring-2" /></label><label className="grid gap-2 text-sm font-bold">Slug<input required value={form.slug} onChange={e=>setForm({...form,slug:e.target.value})} className="rounded-xl border px-4 py-3 font-normal outline-none focus:ring-2" /></label><label className="grid gap-2 text-sm font-bold">توضیح کوتاه<input value={form.shortDescription} onChange={e=>setForm({...form,shortDescription:e.target.value})} className="rounded-xl border px-4 py-3 font-normal outline-none focus:ring-2" /></label><label className="grid gap-2 text-sm font-bold">توضیحات<textarea rows="6" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="rounded-xl border px-4 py-3 font-normal outline-none focus:ring-2" /></label><label className="grid gap-2 text-sm font-bold">وضعیت<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="rounded-xl border px-4 py-3 font-normal"><option value="DRAFT">پیش‌نویس</option><option value="ACTIVE">فعال</option><option value="ARCHIVED">بایگانی</option></select></label><label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" checked={form.isFeatured} onChange={e=>setForm({...form,isFeatured:e.target.checked})} /> محصول ویژه</label>{message && <div className="rounded-xl bg-slate-100 p-3 text-sm">{message}</div>}<button disabled={saving} className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-50">{saving ? 'در حال ذخیره…' : 'ایجاد محصول'}</button></form></section>;
}
