import Link from 'next/link';
import { requireUser } from '../../../lib/auth/session.js';
import { listAddresses } from '../../../server/account/service.js';
import AddressForm from '../../../components/account/AddressForm.js';
import AddressCard from '../../../components/account/AddressCard.js';
export default async function AddressesPage(){const u=await requireUser();const addresses=await listAddresses(u.id);return <section dir="rtl" className="mx-auto max-w-6xl px-4 py-8"><div className="mb-6"><Link href="/account" className="text-sm font-bold">← حساب کاربری</Link><h1 className="mt-3 text-3xl font-black">آدرس‌های من</h1></div><div className="grid gap-6 lg:grid-cols-[360px_1fr]"><AddressForm/><div className="grid gap-4 md:grid-cols-2">{addresses.map(a=><AddressCard key={a.id} address={a}/>)}{!addresses.length&&<div className="rounded-2xl border bg-white p-10 text-center text-slate-500 md:col-span-2">هنوز آدرسی ثبت نکرده‌اید.</div>}</div></div></section>}
