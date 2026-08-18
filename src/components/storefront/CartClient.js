'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const money = (value) => new Intl.NumberFormat('fa-IR').format(Number(value || 0));

export default function CartClient({ initialCart }) {
  const router = useRouter();
  const [cart, setCart] = useState(initialCart);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');

  async function changeItem(itemId, quantity) {
    if (quantity < 1) return removeItem(itemId);
    setBusy(itemId); setError('');
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity }) });
      if (response.status === 401) { router.push(`/login?returnTo=${encodeURIComponent('/cart')}`); return; }
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || 'خطا در بروزرسانی سبد خرید');
      setCart(payload.data.cart);
    } catch (e) { setError(e.message); } finally { setBusy(null); }
  }

  async function removeItem(itemId) {
    setBusy(itemId); setError('');
    try {
      const response = await fetch(`/api/cart/items/${itemId}`, { method: 'DELETE' });
      if (response.status === 401) { router.push(`/login?returnTo=${encodeURIComponent('/cart')}`); return; }
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || 'خطا در حذف محصول');
      setCart(payload.data.cart);
    } catch (e) { setError(e.message); } finally { setBusy(null); }
  }

  if (!cart?.items?.length) {
    return <div className="store-shell py-20 sm:py-28"><div className="mx-auto max-w-lg rounded-[28px] border border-[var(--border)] bg-white px-6 py-14 text-center shadow-[0_16px_50px_rgba(23,23,23,.045)]"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--brand-soft)] text-2xl">🛒</div><h1 className="mt-5 text-2xl font-black">سبد خرید شما خالی است</h1><p className="mt-2 text-[12px] leading-7 text-slate-500">محصولات موردنظرتان را پیدا کنید و اولین خریدتان را شروع کنید.</p><Link href="/products" className="mt-6 inline-flex rounded-[12px] bg-slate-950 px-6 py-3 text-[11px] font-black text-white transition hover:bg-[var(--brand)]">مشاهده محصولات</Link></div></div>;
  }

  return <div className="store-shell py-8 sm:py-10">
    <div><div className="flex items-center gap-2 text-[11px] font-black text-[var(--brand)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />سفارش شما</div><h1 className="mt-2 text-3xl font-black tracking-tight">سبد خرید</h1><p className="mt-2 text-[12px] text-slate-500">کالاهای انتخاب‌شده را بررسی کنید و برای ثبت سفارش ادامه دهید.</p></div>
    {error && <div role="alert" className="mt-5 rounded-[14px] border border-red-100 bg-red-50 px-4 py-3 text-[11px] font-bold text-red-700">{error}</div>}
    <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_350px]">
      <section className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-white shadow-[0_12px_35px_rgba(23,23,23,.035)]">
        {cart.items.map((item, index) => <article key={item.id} className={`flex gap-4 p-4 sm:p-6 ${index ? 'border-t border-[var(--border)]' : ''}`}>
          <Link href={`/products/${item.productSlug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[16px] bg-[#f5f5f2] sm:h-32 sm:w-32">{item.primaryImageUrl ? <Image src={item.primaryImageUrl} alt={item.productName} fill sizes="128px" unoptimized className="object-contain p-2 transition duration-300 hover:scale-105" /> : <span className="flex h-full items-center justify-center text-[10px] text-slate-400">تصویر</span>}</Link>
          <div className="min-w-0 flex-1"><Link href={`/products/${item.productSlug}`} className="line-clamp-2 text-[12px] font-black leading-6 hover:text-[var(--brand)]">{item.productName}</Link><p className="mt-1 text-[10px] font-medium text-slate-400">{item.variantName || item.sku}</p><p className="mt-3 text-[13px] font-black">{money(item.price)} <span className="text-[9px] text-slate-400">تومان</span></p><div className="mt-4 flex items-center justify-between gap-3"><div className="flex h-9 items-center overflow-hidden rounded-[10px] border border-[var(--border)]"><button disabled={busy === item.id} onClick={() => changeItem(item.id, item.quantity + 1)} className="px-3 text-sm font-black hover:bg-slate-50 disabled:opacity-40">+</button><span className="min-w-9 text-center text-[11px] font-black">{money(item.quantity)}</span><button disabled={busy === item.id} onClick={() => changeItem(item.id, item.quantity - 1)} className="px-3 text-sm font-black hover:bg-slate-50 disabled:opacity-40">−</button></div><button disabled={busy === item.id} onClick={() => removeItem(item.id)} className="text-[10px] font-bold text-slate-400 transition hover:text-red-600 disabled:opacity-40">حذف</button></div></div>
          <p className="hidden pt-1 text-[12px] font-black sm:block">{money(item.lineTotal)} تومان</p>
        </article>)}
      </section>
      <aside className="h-fit rounded-[24px] border border-[var(--border)] bg-white p-6 shadow-[0_12px_35px_rgba(23,23,23,.035)] lg:sticky lg:top-24"><div className="flex items-center justify-between"><h2 className="text-[13px] font-black">خلاصه سفارش</h2><span className="rounded-full bg-slate-50 px-2.5 py-1 text-[9px] font-bold text-slate-400">{money(cart.itemCount)} کالا</span></div><div className="mt-6 grid gap-3 text-[11px] text-slate-500"><div className="flex justify-between"><span>جمع کالاها</span><span className="font-bold text-slate-800">{money(cart.subtotal)} تومان</span></div><div className="flex justify-between"><span>هزینه ارسال</span><span className="font-bold text-emerald-600">در مرحله بعد</span></div></div><div className="my-6 border-t border-dashed border-[var(--border)]" /><div className="flex items-end justify-between gap-3"><span className="text-[11px] font-black">مبلغ قابل پرداخت</span><span className="text-xl font-black">{money(cart.subtotal)} <small className="text-[9px] font-bold text-slate-400">تومان</small></span></div><Link href="/checkout" className="mt-6 flex h-12 items-center justify-center rounded-[13px] bg-[var(--brand)] text-[11px] font-black text-white transition hover:bg-[var(--brand-strong)]">ادامه و ثبت سفارش</Link><p className="mt-3 text-center text-[9px] leading-5 text-slate-400">مبلغ نهایی و روش ارسال در مرحله تکمیل سفارش مشخص می‌شود.</p></aside>
    </div>
  </div>;
}
