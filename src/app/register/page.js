'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: '', lastName: '', identity: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  async function handleSubmit(event) {
    event.preventDefault(); setError('');
    if (form.password !== form.confirmPassword) return setError('رمز عبور و تکرار آن یکسان نیستند.');
    if (form.password.length < 8) return setError('رمز عبور باید حداقل ۸ کاراکتر باشد.');
    setLoading(true);
    try {
      const looksLikeEmail = form.identity.includes('@'); const identity = form.identity.trim();
      const registrationBody = { firstName: form.firstName.trim(), lastName: form.lastName.trim(), password: form.password, ...(looksLikeEmail ? { email: identity } : { phone: identity.replace(/[\s()-]/g, '') }) };
      const registerResponse = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(registrationBody) });
      const result = await registerResponse.json();
      if (!registerResponse.ok || !result.success) { const firstError = result.errors ? Object.values(result.errors)[0] : result.error; setError(typeof firstError === 'string' ? firstError : 'اطلاعات واردشده صحیح نیست.'); return; }
      const loginResponse = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: looksLikeEmail ? { email: identity, password: form.password } : { phone: identity.replace(/[\s()-]/g, ''), password: form.password } });
      if (loginResponse.ok) { router.replace('/account'); router.refresh(); } else router.replace('/login?registered=1');
    } catch { setError('ارتباط با سرور برقرار نشد. دوباره تلاش کنید.'); } finally { setLoading(false); }
  }
  const input = 'h-12 w-full border border-slate-200 bg-[#fafaf8] px-4 font-normal outline-none transition placeholder:text-slate-300 focus:border-[var(--brand)] focus:bg-white focus:ring-2 focus:ring-red-50';
  return <main dir="rtl" className="min-h-screen bg-[#f8f8f5] px-4 py-8 sm:py-12"><div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center"><div className="grid w-full overflow-hidden border border-[var(--border)] bg-white shadow-[0_24px_80px_rgba(15,23,42,.06)] lg:grid-cols-[.82fr_1.18fr]">
    <section className="hidden bg-[var(--brand)] p-10 text-white lg:flex lg:flex-col lg:justify-between"><div><Link href="/" className="grid h-11 w-11 place-items-center bg-white text-lg font-black text-[var(--brand)]">ف</Link><p className="mt-10 text-[10px] font-black text-white/65">شروع یک تجربه بهتر</p><h2 className="mt-3 text-4xl font-black leading-[1.25]">حساب شما،<br/>مرکز خرید شما.</h2><p className="mt-5 max-w-sm text-[11px] leading-7 text-white/75">سفارش‌ها، آدرس‌ها و علاقه‌مندی‌های خود را یکجا مدیریت کنید.</p></div><p className="text-[9px] font-bold text-white/50">تجربه‌ای مدرن برای خرید آنلاین در ایران</p></section>
    <section className="p-6 sm:p-10 lg:p-12"><Link href="/" className="text-[10px] font-black text-[var(--brand)]">← فروشگاه</Link><div className="mb-7 mt-7"><p className="text-[10px] font-black text-[var(--brand)]">خوش آمدید</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">ساخت حساب کاربری</h1><p className="mt-2 text-[10px] leading-6 text-slate-400">چند قدم کوتاه تا شروع یک خرید راحت‌تر.</p></div>
      <form onSubmit={handleSubmit} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><label className="text-[10px] font-black text-slate-600">نام<input value={form.firstName} onChange={e=>update('firstName',e.target.value)} autoComplete="given-name" className={`${input} mt-2`} placeholder="مثلاً آرتین"/></label><label className="text-[10px] font-black text-slate-600">نام خانوادگی<input value={form.lastName} onChange={e=>update('lastName',e.target.value)} autoComplete="family-name" className={`${input} mt-2`} placeholder="مثلاً اسعدی"/></label></div><label className="block text-[10px] font-black text-slate-600">ایمیل یا شماره موبایل<input value={form.identity} onChange={e=>update('identity',e.target.value)} autoComplete="username" required dir="ltr" className={`${input} mt-2 text-left text-sm`} placeholder="email@example.com یا +989..."/></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-[10px] font-black text-slate-600">رمز عبور<input type="password" value={form.password} onChange={e=>update('password',e.target.value)} autoComplete="new-password" required minLength={8} dir="ltr" className={`${input} mt-2 text-left text-sm`} placeholder="حداقل ۸ کاراکتر"/></label><label className="text-[10px] font-black text-slate-600">تکرار رمز عبور<input type="password" value={form.confirmPassword} onChange={e=>update('confirmPassword',e.target.value)} autoComplete="new-password" required minLength={8} dir="ltr" className={`${input} mt-2 text-left text-sm`} placeholder="تکرار رمز"/></label></div>{error&&<div role="alert" className="border border-red-100 bg-red-50 px-4 py-3 text-[10px] font-bold leading-6 text-red-700">{error}</div>}<button type="submit" disabled={loading} className="h-12 w-full bg-[var(--brand)] px-4 text-[11px] font-black text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">{loading?'در حال ساخت حساب…':'ساخت حساب'}</button></form><p className="mt-6 border-t border-slate-100 pt-5 text-center text-[10px] text-slate-400">قبلاً حساب دارید؟ <Link href="/login" className="font-black text-[var(--brand)] hover:underline">وارد شوید</Link></p>
    </section></div></div></main>;
}
