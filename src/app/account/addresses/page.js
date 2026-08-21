import Link from 'next/link';
import { requireUser } from '../../../lib/auth/session.js';
import { listAddresses } from '../../../server/account/service.js';
import AddressForm from '../../../components/account/AddressForm.js';
import AddressCard from '../../../components/account/AddressCard.js';

export const metadata = { title: 'آدرس‌های من' };

export default async function AddressesPage() {
  const u = await requireUser();
  const addresses = await listAddresses(u.id);
  return (
    <main dir="rtl" className="store-shell py-7 sm:py-10">
      <header className="relative overflow-hidden rounded-[20px] border border-[var(--border)] bg-[#fafaf8] px-5 py-7 sm:px-7 sm:py-8">
        <div className="absolute -left-14 -top-16 h-40 w-40 rounded-full bg-[var(--brand)]/[0.045] blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><Link href="/account" className="text-[10px] font-black text-slate-400 transition hover:text-[var(--brand)]">← حساب کاربری</Link><p className="mt-5 text-[10px] font-black text-[var(--brand)]">ارسال سریع‌تر، خرید راحت‌تر</p><h1 className="mt-2 text-3xl font-black tracking-tight">آدرس‌های من</h1><p className="mt-2 max-w-xl text-[11px] leading-6 text-slate-500">مقصدهای ارسال را مدیریت کنید تا هنگام خرید، انتخاب آدرس سریع و بدون دردسر باشد.</p></div>
          <div className="flex items-center gap-2 rounded-[12px] border border-[var(--border)] bg-white px-4 py-2.5 shadow-sm"><span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]"/><span className="text-[9px] font-black text-slate-500">{addresses.length.toLocaleString('fa-IR')} آدرس ثبت‌شده</span></div>
        </div>
      </header>
      <div className="mt-6 grid gap-5 lg:grid-cols-[350px_1fr] lg:items-start">
        <div className="lg:sticky lg:top-24"><div className="mb-3 rounded-[14px] border border-[var(--border)] bg-white px-4 py-3"><p className="text-[9px] font-black text-[var(--brand)]">مقصد جدید</p><p className="mt-1 text-[10px] text-slate-400">اطلاعات گیرنده را دقیق وارد کنید.</p></div><AddressForm /></div>
        <div className="grid gap-4 md:grid-cols-2">{addresses.map(a => <div key={a.id} className="group rounded-[18px] border border-[var(--border)] bg-white p-1 shadow-[0_8px_26px_rgba(23,23,23,.025)] transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_38px_rgba(23,23,23,.055)]"><AddressCard address={a} /></div>)}{!addresses.length && <div className="rounded-[18px] border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center md:col-span-2"><div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#fafaf8] text-lg text-slate-300">⌖</div><h2 className="mt-4 text-base font-black">هنوز آدرسی ثبت نکرده‌اید</h2><p className="mt-2 text-[10px] leading-6 text-slate-400">از فرم کنار صفحه اولین آدرس خود را اضافه کنید.</p></div>}</div>
      </div>
    </main>
  );
}
