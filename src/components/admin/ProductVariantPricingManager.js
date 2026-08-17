'use client';

import { useState } from 'react';

export default function ProductVariantPricingManager({ variants, onSaved }) {
  const [drafts, setDrafts] = useState(() => Object.fromEntries((variants || []).map((v) => [v.id, { sku: v.sku || '', name: v.name || '', price: v.price ?? '', compareAtPrice: v.compare_at_price ?? '', quantity: v.quantity ?? 0, lowStockThreshold: v.low_stock_threshold ?? 5 }])));
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState('');

  function update(id, field, value) { setDrafts((current) => ({ ...current, [id]: { ...current[id], [field]: value } })); }

  async function save(id) {
    setBusyId(id); setMessage('');
    try {
      const response = await fetch(`/api/admin/products/${id}/variants`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(drafts[id]) });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message || 'ذخیره تنوع انجام نشد.');
      const updated = result?.data?.variant;
      if (updated) onSaved?.(updated);
      setMessage(`تنوع ${drafts[id].sku} ذخیره شد.`);
    } catch (error) { setMessage(error.message); } finally { setBusyId(null); }
  }

  if (!variants?.length) return null;
  return <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
    <div><h3 className="font-black">قیمت و تخفیف تنوع‌ها</h3><p className="mt-1 text-xs leading-6 text-slate-500">برای اعمال تخفیف، قیمت فعلی را وارد کنید و «قیمت قبل از تخفیف» را بیشتر از آن قرار دهید.</p></div>
    <div className="mt-4 grid gap-3">
      {variants.map((variant) => { const draft = drafts[variant.id]; const current = Number(draft?.price || 0); const before = Number(draft?.compareAtPrice || 0); const percent = before > current && current > 0 ? Math.round((1 - current / before) * 100) : 0; return <div key={variant.id} className="rounded-xl border border-white bg-white p-4 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-bold">{variant.sku}</p>{percent > 0 && <span className="rounded-full bg-[var(--brand)] px-2.5 py-1 text-xs font-black text-white">{percent.toLocaleString('fa-IR')}٪ تخفیف</span>}</div><div className="mt-3 grid gap-3 md:grid-cols-3"><input value={draft?.name ?? ''} onChange={(e) => update(variant.id, 'name', e.target.value)} placeholder="نام تنوع" className="rounded-xl border px-3 py-2.5 text-sm" /><input type="number" min="0" value={draft?.price ?? ''} onChange={(e) => update(variant.id, 'price', e.target.value)} placeholder="قیمت فعلی" className="rounded-xl border px-3 py-2.5 text-sm" /><input type="number" min="0" value={draft?.compareAtPrice ?? ''} onChange={(e) => update(variant.id, 'compareAtPrice', e.target.value)} placeholder="قیمت قبل از تخفیف" className="rounded-xl border px-3 py-2.5 text-sm" /></div><button type="button" onClick={() => save(variant.id)} disabled={busyId === variant.id} className="mt-3 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">{busyId === variant.id ? 'در حال ذخیره…' : 'ذخیره قیمت و تخفیف'}</button></div>; })}
    </div>
    {message && <p className="mt-3 text-sm font-semibold text-slate-600">{message}</p>}
  </div>;
}
