import Link from 'next/link';
import { requireUser } from '../../../lib/auth/session.js';
import { getProfile } from '../../../server/account/service.js';
import ProfileForm from './ProfileForm.js';

export const metadata = { title: 'اطلاعات شخصی' };

export default async function ProfilePage() {
  const u = await requireUser();
  const p = await getProfile(u.id);
  return (
    <main dir="rtl" className="store-shell py-7 sm:py-10">
      <div className="relative mb-6 overflow-hidden rounded-[20px] border border-[var(--border)] bg-[#fafaf8] px-5 py-7 sm:px-7 sm:py-8">
        <div className="absolute -left-14 -top-16 h-40 w-40 rounded-full bg-[var(--brand)]/[0.045] blur-3xl" />
        <div className="relative">
          <Link href="/account" className="text-[10px] font-black text-slate-400 transition hover:text-[var(--brand)]">← بازگشت به حساب کاربری</Link>
          <p className="mt-5 text-[9px] font-black text-[var(--brand)]">حساب کاربری</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">اطلاعات شخصی</h1>
          <p className="mt-2 text-[11px] leading-6 text-slate-500">اطلاعات تماس و مشخصات حساب خود را به‌روز نگه دارید.</p>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[250px_1fr] lg:items-start">
        <aside className="rounded-[18px] border border-[var(--border)] bg-white p-5 shadow-[0_10px_30px_rgba(23,23,23,.025)]">
          <div className="grid h-12 w-12 place-items-center rounded-[14px] bg-[var(--brand-soft)] text-lg font-black text-[var(--brand)]">ش</div>
          <p className="mt-4 text-[11px] font-black">اطلاعات حساب</p>
          <p className="mt-2 break-all text-[9px] leading-5 text-slate-500" dir="ltr">{p?.email || '—'}</p>
          <div className="mt-4 rounded-[11px] bg-[#fafaf8] p-3 text-[8px] leading-5 text-slate-400">ایمیل حساب از این بخش قابل تغییر نیست.</div>
        </aside>
        <section className="rounded-[18px] border border-[var(--border)] bg-white p-5 shadow-[0_10px_30px_rgba(23,23,23,.025)] sm:p-6">
          <div className="mb-5"><p className="text-[9px] font-black text-[var(--brand)]">مشخصات</p><h2 className="mt-1 text-lg font-black">ویرایش اطلاعات</h2></div>
          <ProfileForm profile={p} />
        </section>
      </div>
    </main>
  );
}
