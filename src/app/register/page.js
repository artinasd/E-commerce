'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    identity: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند.');
      return;
    }
    if (form.password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد.');
      return;
    }

    setLoading(true);
    try {
      const looksLikeEmail = form.identity.includes('@');
      const registrationBody = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        password: form.password,
        ...(looksLikeEmail ? { email: form.identity.trim() } : { phone: form.identity.replace(/[\s()-]/g, '') }),
      };

      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationBody),
      });
      const registerResult = await registerResponse.json();

      if (!registerResponse.ok || !registerResult.success) {
        if (registerResult.errors) {
          const firstError = Object.values(registerResult.errors)[0];
          setError(typeof firstError === 'string' ? firstError : 'اطلاعات واردشده صحیح نیست.');
        } else {
          setError(registerResult.error || 'ثبت‌نام انجام نشد.');
        }
        return;
      }

      // Registration creates the account; the existing login endpoint establishes the session.
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          looksLikeEmail
            ? { email: form.identity.trim(), password: form.password }
            : { phone: form.identity.replace(/[\s()-]/g, ''), password: form.password },
        ),
      });

      if (loginResponse.ok) {
        router.replace('/account');
        router.refresh();
      } else {
        router.replace('/login?registered=1');
      }
    } catch {
      setError('ارتباط با سرور برقرار نشد. دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-4 py-10 sm:py-14">
      <div className="mx-auto grid max-w-5xl overflow-hidden border border-[var(--border)] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[0.85fr_1.15fr]">
        <section className="hidden bg-[var(--brand)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <span className="grid h-12 w-12 place-items-center bg-white text-xl font-black text-[var(--brand)]">ف</span>
            <h2 className="mt-10 text-4xl font-black leading-tight">خرید بهتر،<br />ساده‌تر و سریع‌تر.</h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/80">حساب کاربری خود را بسازید و سفارش‌ها، آدرس‌ها و علاقه‌مندی‌هایتان را یکجا مدیریت کنید.</p>
          </div>
          <p className="text-xs text-white/60">تجربه‌ای مدرن برای خرید آنلاین در ایران</p>
        </section>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8">
            <p className="text-sm font-bold text-[var(--brand)]">خوش آمدید</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">ساخت حساب کاربری</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">چند قدم کوتاه تا شروع یک خرید راحت‌تر.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-700">نام<input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} autoComplete="given-name" className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal outline-none transition focus:border-[var(--brand)] focus:bg-white" placeholder="مثلاً آرتین" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">نام خانوادگی<input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} autoComplete="family-name" className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal outline-none transition focus:border-[var(--brand)] focus:bg-white" placeholder="مثلاً اسعدی" /></label>
            </div>

            <label className="grid gap-2 text-sm font-bold text-slate-700">
              ایمیل یا شماره موبایل
              <input value={form.identity} onChange={(e) => update('identity', e.target.value)} autoComplete="username" required dir="ltr" className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-left font-normal outline-none transition focus:border-[var(--brand)] focus:bg-white" placeholder="email@example.com یا +989..." />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-700">رمز عبور<input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} autoComplete="new-password" required minLength={8} dir="ltr" className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-left font-normal outline-none transition focus:border-[var(--brand)] focus:bg-white" placeholder="حداقل ۸ کاراکتر" /></label>
              <label className="grid gap-2 text-sm font-bold text-slate-700">تکرار رمز عبور<input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} autoComplete="new-password" required minLength={8} dir="ltr" className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-left font-normal outline-none transition focus:border-[var(--brand)] focus:bg-white" placeholder="تکرار رمز" /></label>
            </div>

            {error ? <div role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{error}</div> : null}

            <button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-[var(--brand)] px-4 text-sm font-black text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60">{loading ? 'در حال ساخت حساب…' : 'ساخت حساب'}</button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">قبلاً حساب دارید؟ <Link href="/login" className="font-black text-[var(--brand)] hover:underline">وارد شوید</Link></p>
        </section>
      </div>
    </main>
  );
}
