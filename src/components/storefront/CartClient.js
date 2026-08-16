'use client';

import { useState } from 'react';
import Link from 'next/link';

const money = (value) => new Intl.NumberFormat('fa-IR').format(Number(value || 0));

export default function CartClient({ initialCart }) {
  const [cart, setCart] = useState(initialCart);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');

  async function changeItem(itemId, quantity) {
    if (quantity < 1) return removeItem(itemId);
    setBusy(itemId); setError('');
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity }) });
      if (response.status === 401) { window.location.href = `/login?returnTo=${encodeURIComponent('/cart')}`; return; }
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || 'خطا در بروزرسانی سبد خرید');
      setCart(payload.data.cart);
    } catch (e) { setError(e.message); } finally { setBusy(null); }
  }

  async function removeItem(itemId) {
    setBusy(itemId); setError('');
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, { method: 'DELETE' });
      if (response.status === 401) { window.location.href = `/login?returnTo=${encodeURIComponent('/cart')}`; return; }
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || 'خطا در حذف محصول');
      setCart(payload.data.cart);
    } catch (e) { setError(e.message); } finally { setBusy(null); }
  }

  if (!cart?.items?.length) {
    return <div className="mx-auto max-w-2xl px-4 py-24 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">🛒</div><h1 className="mt-5 text-2xl font-black">سبد خرید شما خالی است</h1><p className="mt-2 text-sm text-slate-500">محصولات موردنظرتان را پیدا کنید و به سبد خرید اضافه کنید.</p><Link href="/products" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">مشاهده محصولات</Link></div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div><p className="text-xs font-bold text-[var(--brand)]">سفارش شما</p><h1 className="mt-1 text-2xl font-black">سبد خرید</h1></div>
      {error && <div role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_340px]">
        <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
          {cart.items.map((item, index) => (
            <article key={item.id} className={`flex gap-4 p-4 sm:p-5 ${index ? 'border-t border-[var(--border)]' : ''}`}>
              <Link href={`/products/${item.productSlug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50 sm:h-28 sm:w-28">
                {item.primaryImageUrl ? <img src={item.primaryImageUrl} alt={item.productName} className="h-full w-full object-contain p-2" /> : <span className="flex h-full items-center justify-center text-xs text-slate-400">تصویر</span>}
              </Link>
              <div className="min-w-0 flex-1"><Link href={`/products/${item.productSlug}`} className="line-clamp-2 text-sm font-bold leading-6 hover:text-[var(--brand)]">{item.productName}</Link><p className="mt-1 text-xs text-slate-400">{item.variantName || item.sku}</p><p className="mt-3 text-sm font-black">{money(item.price)} تومان</p>
                <div className="mt-3 flex items-center justify-between gap-3"><div className="flex h-9 items-center rounded-lg border border-[var(--border)]"><button disabled={busy === item.id} onClick={() => changeItem(item.id, item.quantity + 1)} className="px-3 disabled:opacity-40">+</button><span className="min-w-8 text-center text-xs font-bold">{money(item.quantity)}</span><button disabled={busy === item.id} onClick={() => changeItem(item.id, item.quantity - 1)} className="px-3 disabled:opacity-40">−</button></div><button disabled={busy === item.id} onClick={() => removeItem(item.id)} className="text-xs font-semibold text-slate-400 hover:text-red-600 disabled:opacity-40">حذف</button></div>
              </div>
              <p className="hidden text-sm font-black sm:block">{money(item.lineTotal)} تومان</p>
            </article>
          ))}
        </section>
        <aside className="h-fit rounded-2xl border border-[var(--border)] bg-white p-5 lg:sticky lg:top-24"><h2 className="font-black">خلاصه سفارش</h2><div className="mt-5 flex justify-between text-sm text-slate-500"><span>تعداد کالا</span><span>{money(cart.itemCount)}</span></div><div className="mt-3 flex justify-between text-sm text-slate-500"><span>جمع کالاها</span><span>{money(cart.subtotal)} تومان</span></div><div className="my-5 border-t border-[var(--border)]" /><div className="flex justify-between"><span className="text-sm font-bold">مبلغ قابل پرداخت</span><span className="text-lg font-black">{money(cart.subtotal)} <small className="text-xs font-medium text-slate-400">تومان</small></span></div><Link href="/checkout" className="mt-5 flex h-12 items-center justify-center rounded-xl bg-[var(--brand)] text-sm font-bold text-white transition hover:bg-[var(--brand-strong)]">ادامه و ثبت سفارش</Link></aside>
      </div>
    </div>
  );
}
