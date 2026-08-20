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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><Link href="/account" className="text-[10px] font-black text-slate-400 transition hover:text-[var(--brand)]">← حساب کاربری</Link><p className="mt-5 text-[10px] font-black text-[var(--brand)]">ارسال سریع‌تر، خرید راحت‌تر</p><h1 className="mt-2 text-3xl font-black tracking-tight">آدرس‌های من</h1><p className="mt-2 text-[11px] text-slate-400">آدرس‌های ارسال خود را مدیریت کنید.</p></div><span className="w-fit border border-[var(--border)] bg-white px-4 py-2 text-[9px] font-black text-slate-500">{addresses.length.toLocaleString('fa-IR')} آدرس</span>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[350px_1fr] lg:items-start"><div className="lg:sticky lg:top-24"><AddressForm /></div><div className="grid gap-4 md:grid-cols-2">{addresses.map(a => <AddressCard key={a.id} address={a} />)}{!addresses.length && <div className="border border-dashed border-[var(--border)] bg-white px-6 py-16 text-center md:col-span-2"><div className="mx-auto grid h-12 w-12 place-items-center bg-[#fafaf8] text-lg text-slate-300">⌖</div><h2 className="mt-4 text-base font-black">هنوز آدرسی ثبت نکرده‌اید</h2><p className="mt-2 text-[10px] leading-6 text-slate-400">از فرم کنار صفحه اولین آدرس خود را اضافه کنید.</p></div>}</div></div>
    </main>
  );
}
