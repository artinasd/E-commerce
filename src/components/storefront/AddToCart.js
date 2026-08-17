'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AddToCart({ variants }) {
  const router = useRouter();
  const pathname = usePathname();
  const available = variants.filter((variant) => Number(variant.available_quantity) > 0);
  const [variantId, setVariantId] = useState(available[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('idle');
  const selected = available.find((variant) => Number(variant.id) === Number(variantId));

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

  if (!available.length) return <div className="rounded-xl bg-slate-100 p-4 text-sm font-semibold text-slate-500">این محصول در حال حاضر موجود نیست.</div>;

  return (
    <div className="space-y-4">
      {available.length > 1 && (
        <div>
          <label className="mb-2 block text-sm font-bold">انتخاب مدل</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {available.map((variant) => (
              <button key={variant.id} type="button" onClick={() => { setVariantId(variant.id); setQuantity(1); setStatus('idle'); }} className={`rounded-xl border p-3 text-right transition ${Number(variant.id) === Number(variantId) ? 'border-[var(--brand)] bg-red-50/50' : 'border-[var(--border)] bg-white hover:border-slate-300'}`}>
                <span className="block text-sm font-semibold">{variant.name || variant.sku}</span>
                <span className="mt-1 block text-xs text-slate-500">{new Intl.NumberFormat('fa-IR').format(Number(variant.price))} تومان</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-3">
        <div className="flex h-12 items-center rounded-xl border border-[var(--border)] bg-white">
          <button type="button" aria-label="افزایش تعداد" className="px-3 text-lg" onClick={() => setQuantity((value) => Math.min(value + 1, Number(selected.available_quantity)))}>+</button>
          <span className="min-w-8 text-center text-sm font-bold">{new Intl.NumberFormat('fa-IR').format(quantity)}</span>
          <button type="button" aria-label="کاهش تعداد" className="px-3 text-lg" onClick={() => setQuantity((value) => Math.max(value - 1, 1))}>−</button>
        </div>
        <button type="button" onClick={addToCart} disabled={status === 'loading'} className="h-12 flex-1 rounded-xl bg-[var(--brand)] px-5 text-sm font-bold text-white transition hover:bg-[var(--brand-strong)] disabled:cursor-wait disabled:opacity-60">
          {status === 'loading' ? 'در حال افزودن...' : status === 'success' ? 'به سبد اضافه شد ✓' : 'افزودن به سبد خرید'}
        </button>
      </div>
      {status === 'error' && <p className="text-sm font-medium text-red-600">افزودن محصول انجام نشد. لطفاً دوباره تلاش کنید.</p>}
    </div>
  );
}
