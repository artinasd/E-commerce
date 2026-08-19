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
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const looksLikeEmail = identity.includes('@');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(looksLikeEmail ? { email: identity, password } : { phone: identity, password }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.error || 'ورود ناموفق بود.');
        return;
      }
      router.replace(next.startsWith('/') ? next : '/account');
      router.refresh();
    } catch {
      setError('ارتباط با سرور برقرار نشد. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f8f8f5] px-4 py-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <div className="mb-7 text-center">
          <Link href="/" className="text-xs font-black text-[var(--brand)]">فروشگاه ایرانی</Link>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">خوش آمدید</h1>
          <p className="mx-auto mt-3 max-w-sm text-[11px] leading-7 text-slate-500">برای مشاهده حساب، سفارش‌ها، آدرس‌ها و علاقه‌مندی‌های خود وارد شوید.</p>
        </div>
        <form onSubmit={handleSubmit} className="border border-[var(--border)] bg-white p-6 shadow-[0_18px_55px_rgba(23,23,23,.045)] sm:p-8">
          <label className="block text-[11px] font-black text-slate-700" htmlFor="identity">ایمیل یا شماره موبایل</label>
          <input id="identity" value={identity} onChange={(event) => setIdentity(event.target.value)} autoComplete="username" required dir="ltr" className="mt-2 h-12 w-full border border-slate-200 bg-[#fafaf8] px-4 text-sm outline-none transition focus:border-[var(--brand)] focus:bg-white focus:ring-2 focus:ring-[var(--brand-soft)]" placeholder="email@example.com" />
          <label className="mt-5 block text-[11px] font-black text-slate-700" htmlFor="password">رمز عبور</label>
          <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required minLength={8} dir="ltr" className="mt-2 h-12 w-full border border-slate-200 bg-[#fafaf8] px-4 text-sm outline-none transition focus:border-[var(--brand)] focus:bg-white focus:ring-2 focus:ring-[var(--brand-soft)]" placeholder="••••••••" />
          {error ? <div role="alert" className="mt-5 border border-red-100 bg-red-50 px-4 py-3 text-[11px] leading-6 text-red-700">{error}</div> : null}
          <button type="submit" disabled={loading} className="mt-6 min-h-12 w-full border border-slate-950 bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:border-[var(--brand)] hover:bg-[var(--brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'در حال ورود...' : 'ورود به حساب'}</button>
          <div className="mt-5 border-t border-slate-100 pt-5 text-center text-[11px] text-slate-500">حساب کاربری ندارید؟ <Link href="/register" className="font-black text-[var(--brand)] hover:underline">ثبت‌نام کنید</Link></div>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<main dir="rtl" className="min-h-screen bg-[#f8f8f5]" />}><LoginForm /></Suspense>;
}
