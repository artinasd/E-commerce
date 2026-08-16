import Link from 'next/link';
import { requireUser } from '../../../lib/auth/session.js';
import { getProfile } from '../../../server/account/service.js';
import ProfileForm from './ProfileForm.js';
export default async function ProfilePage(){const u=await requireUser();const p=await getProfile(u.id);return <section dir="rtl" className="mx-auto max-w-3xl"><div className="mb-6"><Link href="/account" className="text-sm font-bold">← بازگشت به حساب کاربری</Link><h1 className="mt-3 text-3xl font-black">اطلاعات شخصی</h1></div><div className="rounded-2xl border bg-white p-6 shadow-sm"><div className="mb-5"><p className="text-sm text-slate-500">ایمیل حساب</p><p className="mt-1 font-bold" dir="ltr">{p?.email||'—'}</p><p className="mt-1 text-xs text-slate-400">ایمیل فعلاً از این بخش قابل تغییر نیست.</p></div><ProfileForm profile={p}/></div></section>}
