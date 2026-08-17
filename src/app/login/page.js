'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

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
        body: JSON.stringify(
          looksLikeEmail
            ? { email: identity, password }
            : { phone: identity, password },
        ),
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
    <main dir="rtl" className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-slate-500">فروشگاه ایرانی</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">ورود به حساب کاربری</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            برای مشاهده حساب، سفارش‌ها، آدرس‌ها و علاقه‌مندی‌های خود وارد شوید.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <label className="block text-sm font-bold text-slate-700" htmlFor="identity">
            ایمیل یا شماره موبایل
          </label>
          <input
            id="identity"
            value={identity}
            onChange={(event) => setIdentity(event.target.value)}
            autoComplete="username"
            required
            dir="ltr"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            placeholder="email@example.com"
          />

          <label className="mt-5 block text-sm font-bold text-slate-700" htmlFor="password">
            رمز عبور
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            minLength={8}
            dir="ltr"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            placeholder="••••••••"
          />

          {error ? (
            <div role="alert" className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main dir="rtl" className="min-h-screen bg-slate-50" />}>
      <LoginForm />
    </Suspense>
  );
}
