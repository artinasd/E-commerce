'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MockPaymentPage() {
  const params = useSearchParams();
  const router = useRouter();
  const paymentId = params.get('paymentId');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function finish(success) {
    if (!paymentId || status === 'loading') return;
    setStatus('loading');
    setMessage(success ? 'در حال شبیه‌سازی پرداخت موفق...' : 'در حال شبیه‌سازی پرداخت ناموفق...');
    try {
      const response = await fetch('/api/payments/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: Number(paymentId), success }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message || 'پردازش پرداخت انجام نشد.');
      const order = payload.data.payment;
      router.push(`/orders/${order.orderId}?payment=${order.status.toLowerCase()}`);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'خطایی رخ داد.');
    }
  }

  return (
    <main dir="rtl" className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-12">
      <section className="w-full rounded-3xl border bg-white p-7 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-2xl text-white">₮</div>
        <p className="mt-5 text-xs font-bold text-slate-500">محیط تست پرداخت</p>
        <h1 className="mt-2 text-2xl font-black">شبیه‌ساز درگاه پرداخت</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">هیچ تراکنش واقعی انجام نمی‌شود. این صفحه فقط برای تست کامل چرخه سفارش، پرداخت و موجودی فروشگاه است.</p>
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-right text-sm">
          <p><b>شناسه پرداخت:</b> {paymentId || 'نامعتبر'}</p>
          <p className="mt-2 text-xs text-slate-500">موفقیت پرداخت، موجودی رزروشده را مصرف و سفارش را تایید می‌کند. شکست پرداخت، رزرو را آزاد می‌کند.</p>
        </div>
        {message && <p role={status === 'error' ? 'alert' : 'status'} className={`mt-4 text-sm font-semibold ${status === 'error' ? 'text-red-600' : 'text-slate-600'}`}>{message}</p>}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button disabled={!paymentId || status === 'loading'} onClick={() => finish(true)} className="rounded-xl bg-emerald-600 px-5 py-3 font-black text-white disabled:opacity-50">پرداخت موفق</button>
          <button disabled={!paymentId || status === 'loading'} onClick={() => finish(false)} className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-black text-red-700 disabled:opacity-50">پرداخت ناموفق</button>
        </div>
        <Link href="/products" className="mt-5 inline-block text-sm font-bold text-slate-500 hover:text-slate-950">بازگشت به فروشگاه</Link>
      </section>
    </main>
  );
}
