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

  if (!cart?.items?.length) return <div dir="rtl" className="store-shell py-20 sm:py-28 bg-slate-50"><div className="mx-auto max-w-lg overflow-hidden rounded-[28px] border border-slate-100 bg-white px-6 py-14 text-center shadow-xl shadow-indigo-100/30"><div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-indigo-50 text-indigo-600 shadow-inner"><span className="text-3xl">🛒</span></div><h1 className="mt-8 text-2xl font-black text-slate-800">سبد خرید شما خالی است</h1><p className="mx-auto mt-4 max-w-sm text-[13px] leading-7 text-slate-500">محصولات موردعلاقه‌تان را پیدا کنید و خریدتان را از همین‌جا شروع کنید.</p><Link href="/products" className="mt-8 inline-flex rounded-2xl bg-indigo-600 px-8 py-3.5 text-[12px] font-black text-white shadow-lg shadow-indigo-200 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700">مشاهده محصولات</Link></div></div>;

  return <div dir="rtl" className="store-shell py-8 sm:py-12 bg-slate-50">
    <header className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10"><div className="absolute -left-14 -top-16 h-48 w-48 rounded-full bg-indigo-600/5 blur-3xl"/><div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2 text-[10px] font-black text-indigo-600"><span className="h-2 w-2 rounded-full bg-indigo-600"/>خرید شما</div><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">سبد خرید</h1><p className="mt-3 text-[13px] leading-6 text-slate-500">کالاهای انتخاب‌شده را بررسی کنید و برای تکمیل سفارش ادامه دهید.</p></div><Link href="/products" className="inline-flex w-fit rounded-xl bg-slate-50 px-5 py-3 text-[11px] font-black text-slate-700 ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:text-indigo-600">ادامه خرید</Link></div></header>
    {error && <div role="alert" className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-[12px] font-bold text-red-700 shadow-sm">{error}</div>}
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
      <section aria-label="کالاهای سبد خرید" className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-indigo-100/20">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8"><h2 className="text-[14px] font-black text-slate-800">اقلام انتخاب‌شده</h2><span className="rounded-lg bg-indigo-50 px-3.5 py-1.5 text-[11px] font-bold text-indigo-600">{money(cart.itemCount)} کالا</span></div>
        {cart.items.map((item, index) => <article key={item.id} className={`flex gap-4 p-5 sm:gap-6 sm:p-8 ${index ? 'border-t border-slate-100' : ''}`}>
          <Link href={`/products/${item.productSlug}`} aria-label={`مشاهده ${item.productName}`} className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-50 ring-1 ring-slate-100 transition-all duration-300 hover:shadow-md sm:h-36 sm:w-36">{item.primaryImageUrl ? <Image src={item.primaryImageUrl} alt={item.productName} fill sizes="(max-width: 640px) 112px, 144px" unoptimized className="object-contain p-3 transition-transform duration-700 hover:scale-110"/> : <span className="flex h-full items-center justify-center text-[10px] text-slate-400">تصویر ندارد</span>}</Link>
          <div className="min-w-0 flex-1"><Link href={`/products/${item.productSlug}`} className="line-clamp-2 text-[14px] font-black leading-7 text-slate-800 transition-colors hover:text-indigo-600">{item.productName}</Link><p className="mt-1.5 text-[11px] font-medium text-slate-500">{item.variantName || item.sku}</p><p className="mt-3 text-[15px] font-black text-slate-900">{money(item.price)} <span className="text-[10px] font-bold text-slate-500">تومان</span></p><div className="mt-5 flex items-center justify-between gap-4"><div className="flex h-10 overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200"><button type="button" disabled={busy === item.id} onClick={() => changeItem(item.id, item.quantity + 1)} className="px-3.5 text-base font-black text-slate-600 transition-colors hover:bg-slate-200 hover:text-indigo-600 disabled:opacity-40" aria-label={`افزایش تعداد ${item.productName}`}>+</button><span className="grid min-w-12 place-items-center border-x border-slate-200 bg-white text-[12px] font-black text-slate-800" aria-live="polite">{money(item.quantity)}</span><button type="button" disabled={busy === item.id} onClick={() => changeItem(item.id, item.quantity - 1)} className="px-3.5 text-base font-black text-slate-600 transition-colors hover:bg-slate-200 hover:text-indigo-600 disabled:opacity-40" aria-label={`کاهش تعداد ${item.productName}`}>−</button></div><button type="button" disabled={busy === item.id} onClick={() => removeItem(item.id)} className="rounded-xl px-3 py-1.5 text-[11px] font-bold text-red-500 transition-all hover:bg-red-50 hover:text-red-700 disabled:opacity-40">حذف</button></div></div>
          <p className="hidden shrink-0 pt-1 text-[13px] font-black text-slate-800 sm:block">{money(item.lineTotal)} تومان</p>
        </article>)}
      </section>
      <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-7 shadow-xl shadow-indigo-100/30 lg:sticky lg:top-28"><div className="flex items-center justify-between"><div><p className="text-[10px] font-black text-indigo-600">خلاصه خرید</p><h2 className="mt-1 text-lg font-black text-slate-800">جمع سفارش</h2></div><span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-[10px] font-bold text-indigo-600">{money(cart.itemCount)} کالا</span></div><div className="mt-7 space-y-4 text-[12px]"><div className="flex justify-between text-slate-600"><span>جمع کالاها</span><span className="font-black text-slate-900">{money(cart.subtotal)} تومان</span></div><div className="flex justify-between text-slate-600"><span>هزینه ارسال</span><span className="font-black text-indigo-600">در مرحله بعد</span></div></div><div className="my-7 border-t border-dashed border-slate-200"/><div className="flex items-end justify-between gap-4"><span className="text-[12px] font-black text-slate-700">مبلغ قابل پرداخت</span><div className="text-left"><strong className="text-2xl font-black text-slate-900">{money(cart.subtotal)}</strong><small className="mr-1 text-[10px] font-bold text-slate-500">تومان</small></div></div><Link href="/checkout" className="mt-8 flex h-14 items-center justify-center rounded-2xl bg-indigo-600 text-[12px] font-black text-white shadow-lg shadow-indigo-200 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-xl">ادامه و ثبت سفارش <span className="mr-2 text-base">←</span></Link><p className="mt-4 text-center text-[10px] leading-6 text-slate-500">مبلغ نهایی و روش ارسال در مرحله تکمیل سفارش مشخص می‌شود.</p></aside>
    </div>
  </div>;
}
