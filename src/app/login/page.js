'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/account';
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const looksLikeEmail = identity.includes('@');
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(looksLikeEmail ? { email: identity, password } : { phone: identity, password }) });
      const result = await response.json();
      if (!response.ok || !result.success) { setError(result.error || 'ورود ناموفق بود.'); return; }
      router.replace(next.startsWith('/') ? next : '/account'); router.refresh();
    } catch { setError('ارتباط با سرور برقرار نشد. دوباره تلاش کنید.'); } finally { setLoading(false); }
  }

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#f7f7f4] px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-5xl overflow-hidden rounded-[26px] border border-[var(--border)] bg-white shadow-[0_24px_80px_rgba(23,23,23,.07)] lg:grid-cols-[.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--brand)]/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="relative"><Link href="/" className="text-sm font-black tracking-tight">فروشگاه ایرانی</Link><div className="mt-24 max-w-sm"><p className="text-[10px] font-black text-rose-300">خوش آمدید</p><h2 className="mt-3 text-4xl font-black leading-tight">خریدهای شما،<br/>همیشه یک قدم نزدیک‌تر.</h2><p className="mt-5 text-[11px] leading-7 text-slate-300">سفارش‌ها، آدرس‌ها و محصولات موردعلاقه‌تان را از یک حساب مدیریت کنید.</p></div></div>
          <div className="relative flex gap-2 text-[8px] font-bold text-slate-400"><span className="rounded-full border border-white/10 px-3 py-1.5">سریع</span><span className="rounded-full border border-white/10 px-3 py-1.5">ساده</span><span className="rounded-full border border-white/10 px-3 py-1.5">ایمن</span></div>
        </section>
        <section className="flex items-center p-6 sm:p-10 lg:p-14">
          <div className="w-full max-w-md mx-auto">
            <Link href="/" className="inline-flex text-xs font-black text-[var(--brand)] lg:hidden">فروشگاه ایرانی</Link>
            <p className="mt-7 text-[10px] font-black text-[var(--brand)] lg:mt-0">حساب کاربری</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">خوش آمدید</h1>
            <p className="mt-3 text-[11px] leading-7 text-slate-500">برای ادامه خرید و دسترسی به سفارش‌ها وارد حساب خود شوید.</p>
            <form onSubmit={handleSubmit} className="mt-8">
              <label className="block text-[10px] font-black text-slate-700" htmlFor="identity">ایمیل یا شماره موبایل</label>
              <div className="relative mt-2"><input id="identity" value={identity} onChange={(event) => setIdentity(event.target.value)} autoComplete="username" required dir="ltr" className="h-13 w-full rounded-[13px] border border-slate-200 bg-[#fafaf8] px-4 text-sm outline-none transition focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-red-50" placeholder="email@example.com" /></div>
              <div className="mt-5 flex items-center justify-between"><label className="text-[10px] font-black text-slate-700" htmlFor="password">رمز عبور</label><span className="text-[8px] text-slate-400">حداقل ۸ کاراکتر</span></div>
              <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required minLength={8} dir="ltr" className="mt-2 h-13 w-full rounded-[13px] border border-slate-200 bg-[#fafaf8] px-4 text-sm outline-none transition focus:border-[var(--brand)] focus:bg-white focus:ring-4 focus:ring-red-50" placeholder="••••••••" />
              {error ? <div role="alert" className="mt-4 rounded-[12px] border border-red-100 bg-red-50 px-4 py-3 text-[10px] leading-6 font-bold text-red-700">{error}</div> : null}
              <button type="submit" disabled={loading} className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-[13px] bg-[var(--brand)] px-4 text-[10px] font-black text-white shadow-[0_12px_28px_rgba(225,29,72,.17)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_34px_rgba(225,29,72,.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'در حال ورود...' : 'ورود به حساب'}{!loading && <span className="text-sm">←</span>}</button>
            </form>
            <div className="mt-7 border-t border-slate-100 pt-6 text-center text-[10px] text-slate-500">حساب کاربری ندارید؟ <Link href="/register" className="font-black text-[var(--brand)] transition hover:underline">ثبت‌نام کنید</Link></div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<main dir="rtl" className="min-h-screen bg-[#f7f7f4]" />}><LoginForm /></Suspense>;
}
