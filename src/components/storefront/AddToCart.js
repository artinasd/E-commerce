'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const formatPrice = (value) => new Intl.NumberFormat('fa-IR').format(Number(value || 0));

export default function AddToCart({ variants }) {
  const router = useRouter();
  const pathname = usePathname();
  const available = variants.filter((variant) => Number(variant.available_quantity) > 0);
  const [variantId, setVariantId] = useState(available[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('idle');
  const selected = available.find((variant) => Number(variant.id) === Number(variantId));
  const maxQuantity = Number(selected?.available_quantity || 1);

  async function addToCart() {
    if (!selected) return;
    setStatus('loading');
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId: selected.id, quantity }),
      });
      if (response.status === 401) {
        router.push(`/login?returnTo=${encodeURIComponent(pathname || '/')}`);
        return;
      }
      if (!response.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (!available.length) return <div className="border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-500">این محصول در حال حاضر موجود نیست.</div>;

  return (
    <div className="space-y-5">
      {available.length > 1 && (
        <div>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <label className="block text-sm font-black text-[#202020]">انتخاب مدل</label>
              <p className="mt-1 text-[11px] font-medium text-slate-400">مدل موردنظر خود را انتخاب کنید</p>
            </div>
            <span className="text-[10px] font-bold text-slate-400">{available.length.toLocaleString('fa-IR')} گزینه</span>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {available.map((variant) => {
              const isSelected = Number(variant.id) === Number(variantId);
              return (
                <button key={variant.id} type="button" onClick={() => { setVariantId(variant.id); setQuantity(1); setStatus('idle'); }} aria-pressed={isSelected} className={`group relative overflow-hidden border p-3.5 text-right transition duration-200 ${isSelected ? 'border-[var(--brand)] bg-[var(--brand)]/[0.045] shadow-[0_8px_24px_rgba(0,0,0,.06)]' : 'border-[var(--border)] bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(0,0,0,.05)]'}`}>
                  <span className="flex items-center justify-between gap-3">
                    <span className="min-w-0">
                      <span className={`block truncate text-sm font-black ${isSelected ? 'text-[var(--brand)]' : 'text-[#202020]'}`}>{variant.name || variant.sku}</span>
                      <span className="mt-1 block text-xs font-bold text-slate-500">{formatPrice(variant.price)} تومان</span>
                    </span>
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs transition ${isSelected ? 'border-[var(--brand)] bg-[var(--brand)] text-white' : 'border-slate-300 bg-white text-transparent group-hover:border-slate-400'}`}>✓</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex h-14 items-center justify-between border border-[var(--border)] bg-white px-1 shadow-sm sm:w-36">
          <button type="button" aria-label="افزایش تعداد" disabled={quantity >= maxQuantity} className="flex h-12 w-11 items-center justify-center text-xl font-black text-slate-500 transition hover:bg-slate-50 hover:text-[#202020] disabled:cursor-not-allowed disabled:opacity-30" onClick={() => setQuantity((value) => Math.min(value + 1, maxQuantity))}>+</button>
          <span className="min-w-8 text-center text-sm font-black text-[#202020]">{formatPrice(quantity)}</span>
          <button type="button" aria-label="کاهش تعداد" disabled={quantity <= 1} className="flex h-12 w-11 items-center justify-center text-xl font-black text-slate-500 transition hover:bg-slate-50 hover:text-[#202020] disabled:cursor-not-allowed disabled:opacity-30" onClick={() => setQuantity((value) => Math.max(value - 1, 1))}>−</button>
        </div>
        <button type="button" onClick={addToCart} disabled={status === 'loading'} className="group relative h-14 flex-1 overflow-hidden bg-[var(--brand)] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(0,0,0,.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--brand-strong)] hover:shadow-[0_16px_34px_rgba(0,0,0,.16)] disabled:cursor-wait disabled:translate-y-0 disabled:opacity-60">
          <span className="relative z-10">{status === 'loading' ? 'در حال افزودن...' : status === 'success' ? 'به سبد اضافه شد ✓' : 'افزودن به سبد خرید'}</span>
        </button>
      </div>
      {status === 'success' && <p className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">محصول با موفقیت به سبد خرید اضافه شد.</p>}
      {status === 'error' && <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">افزودن محصول انجام نشد. لطفاً دوباره تلاش کنید.</p>}
    </div>
  );
}
