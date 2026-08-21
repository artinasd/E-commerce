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

  if (!cart?.items?.length) return <div dir="rtl" className="store-shell py-20 sm:py-28"><div className="mx-auto max-w-lg overflow-hidden rounded-[24px] border border-[var(--border)] bg-white px-6 py-14 text-center shadow-[0_18px_55px_rgba(23,23,23,.05)]"><div className="mx-auto grid h-16 w-16 place-items-center rounded-[18px] bg-[var(--brand-soft)] text-[var(--brand)]"><span className="text-2xl">🛒</span></div><h1 className="mt-6 text-2xl font-black">سبد خرید شما خالی است</h1><p className="mx-auto mt-3 max-w-sm text-[11px] leading-7 text-slate-500">محصولات موردعلاقه‌تان را پیدا کنید و خریدتان را از همین‌جا شروع کنید.</p><Link href="/products" className="mt-6 inline-flex rounded-[12px] bg-[var(--brand)] px-7 py-3 text-[10px] font-black text-white shadow-[0_8px_20px_rgba(225,29,72,.15)] transition hover:-translate-y-0.5 hover:bg-[var(--brand-strong)]">مشاهده محصولات</Link></div></div>;

  return <div dir="rtl" className="store-shell py-8 sm:py-10">
    <header className="relative overflow-hidden rounded-[22px] border border-[var(--border)] bg-[#fafaf8] px-5 py-7 sm:px-7 sm:py-8"><div className="absolute -left-14 -top-16 h-40 w-40 rounded-full bg-[var(--brand)]/[0.045] blur-3xl"/><div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2 text-[9px] font-black text-[var(--brand)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]"/>خرید شما</div><h1 className="mt-2 text-3xl font-black tracking-tight">سبد خرید</h1><p className="mt-2 text-[11px] leading-6 text-slate-500">کالاهای انتخاب‌شده را بررسی کنید و برای تکمیل سفارش ادامه دهید.</p></div><Link href="/products" className="inline-flex w-fit rounded-[11px] border border-[var(--border)] bg-white px-4 py-2.5 text-[10px] font-black transition hover:-translate-y-0.5 hover:border-slate-300">ادامه خرید</Link></div></header>
    {error && <div role="alert" className="mt-5 rounded-[14px] border border-red-100 bg-red-50 px-4 py-3 text-[10px] font-bold text-red-700">{error}</div>}
    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_350px]">
      <section aria-label="کالاهای سبد خرید" className="overflow-hidden rounded-[22px] border border-[var(--border)] bg-white shadow-[0_12px_35px_rgba(23,23,23,.035)]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 sm:px-6"><h2 className="text-[12px] font-black">اقلام انتخاب‌شده</h2><span className="rounded-full bg-slate-50 px-3 py-1.5 text-[9px] font-bold text-slate-400">{money(cart.itemCount)} کالا</span></div>
        {cart.items.map((item, index) => <article key={item.id} className={`flex gap-3.5 p-4 sm:gap-5 sm:p-6 ${index ? 'border-t border-[var(--border)]' : ''}`}>
          <Link href={`/products/${item.productSlug}`} aria-label={`مشاهده ${item.productName}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[16px] bg-[#f7f6f2] transition hover:shadow-[0_8px_22px_rgba(23,23,23,.07)] sm:h-32 sm:w-32">{item.primaryImageUrl ? <Image src={item.primaryImageUrl} alt={item.productName} fill sizes="(max-width: 640px) 96px, 128px" unoptimized className="object-contain p-2 transition duration-500 hover:scale-105"/> : <span className="flex h-full items-center justify-center text-[9px] text-slate-400">تصویر ندارد</span>}</Link>
          <div className="min-w-0 flex-1"><Link href={`/products/${item.productSlug}`} className="line-clamp-2 text-[12px] font-black leading-6 transition hover:text-[var(--brand)]">{item.productName}</Link><p className="mt-1 text-[9px] font-medium text-slate-400">{item.variantName || item.sku}</p><p className="mt-2 text-[13px] font-black">{money(item.price)} <span className="text-[8px] text-slate-400">تومان</span></p><div className="mt-4 flex items-center justify-between gap-3"><div className="flex h-9 overflow-hidden rounded-[10px] border border-[var(--border)] bg-white"><button type="button" disabled={busy === item.id} onClick={() => changeItem(item.id, item.quantity + 1)} className="px-3 text-sm font-black transition hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] disabled:opacity-40" aria-label={`افزایش تعداد ${item.productName}`}>+</button><span className="grid min-w-10 place-items-center border-x border-[var(--border)] text-[10px] font-black" aria-live="polite">{money(item.quantity)}</span><button type="button" disabled={busy === item.id} onClick={() => changeItem(item.id, item.quantity - 1)} className="px-3 text-sm font-black transition hover:bg-[var(--brand-soft)] hover:text-[var(--brand)] disabled:opacity-40" aria-label={`کاهش تعداد ${item.productName}`}>−</button></div><button type="button" disabled={busy === item.id} onClick={() => removeItem(item.id)} className="rounded-lg px-2 py-1 text-[9px] font-bold text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-40">حذف</button></div></div>
          <p className="hidden shrink-0 pt-1 text-[11px] font-black sm:block">{money(item.lineTotal)} تومان</p>
        </article>)}
      </section>
      <aside className="h-fit rounded-[22px] border border-[var(--border)] bg-white p-6 shadow-[0_14px_38px_rgba(23,23,23,.045)] lg:sticky lg:top-24"><div className="flex items-center justify-between"><div><p className="text-[9px] font-black text-[var(--brand)]">خلاصه خرید</p><h2 className="mt-1 text-base font-black">جمع سفارش</h2></div><span className="rounded-full bg-slate-50 px-2.5 py-1 text-[8px] font-bold text-slate-400">{money(cart.itemCount)} کالا</span></div><div className="mt-6 space-y-3 text-[10px]"><div className="flex justify-between text-slate-500"><span>جمع کالاها</span><span className="font-black text-slate-800">{money(cart.subtotal)} تومان</span></div><div className="flex justify-between text-slate-500"><span>هزینه ارسال</span><span className="font-black text-emerald-600">در مرحله بعد</span></div></div><div className="my-6 border-t border-dashed border-[var(--border)]"/><div className="flex items-end justify-between gap-3"><span className="text-[10px] font-black">مبلغ قابل پرداخت</span><div className="text-left"><strong className="text-xl font-black">{money(cart.subtotal)}</strong><small className="mr-1 text-[8px] font-bold text-slate-400">تومان</small></div></div><Link href="/checkout" className="mt-6 flex h-12 items-center justify-center rounded-[13px] bg-[var(--brand)] text-[10px] font-black text-white shadow-[0_9px_22px_rgba(225,29,72,.14)] transition hover:-translate-y-0.5 hover:bg-[var(--brand-strong)]">ادامه و ثبت سفارش <span className="mr-2 text-sm">←</span></Link><p className="mt-3 text-center text-[8px] leading-5 text-slate-400">مبلغ نهایی و روش ارسال در مرحله تکمیل سفارش مشخص می‌شود.</p></aside>
    </div>
  </div>;
}
