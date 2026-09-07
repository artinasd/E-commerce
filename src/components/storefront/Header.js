'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [['محصولات', '/products'], ['دسته‌بندی‌ها', '/categories'], ['برندها', '/brands']];
function UserIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]"><circle cx="12" cy="8" r="3.2"/><path d="M5.5 19.2c.8-3.2 3.1-4.8 6.5-4.8s5.7 1.6 6.5 4.8"/></svg>; }
function CartIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]"><path d="M4 5h2l1.4 9.1a2 2 0 0 0 2 1.7h7.5a2 2 0 0 0 1.9-1.4L20 8H7"/><circle cx="10" cy="19" r="1"/><circle cx="17" cy="19" r="1"/></svg>; }
function SearchIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.8]"><circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 4 4"/></svg>; }

export default function Header() {
  const router = useRouter(); const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false); const [user, setUser] = useState(null); const [loggingOut, setLoggingOut] = useState(false);
  useEffect(() => { let active = true; fetch('/api/auth/me', { cache: 'no-store' }).then((r) => r.ok ? r.json() : null).then((r) => { if (active) setUser(r?.data?.user ?? null); }).catch(() => { if (active) setUser(null); }); return () => { active = false; }; }, []);
  async function handleLogout() { if (loggingOut) return; setLoggingOut(true); try { const r = await fetch('/api/auth/logout', { method: 'POST' }); if (!r.ok) throw new Error(); router.push('/'); router.refresh(); } catch { setLoggingOut(false); } }
  return <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl shadow-md shadow-gray-100/50">
    <div className="store-shell">
      <div className="flex min-h-[76px] items-center gap-3 sm:min-h-[80px] sm:gap-4 lg:min-h-[84px] lg:gap-7">
        <Link href="/" className="group flex shrink-0 items-center gap-3 transition-transform hover:-translate-y-0.5" aria-label="صفحه اصلی"><span className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-600 text-[18px] font-black text-white shadow-lg shadow-indigo-200">ف</span><span className="text-[20px] font-black tracking-[-.045em] text-slate-800 sm:text-[22px]">فروشگاه</span></Link>
        <nav className="hidden items-center gap-2 lg:flex" aria-label="ناوبری اصلی">{navItems.map(([label, href]) => <Link key={href} href={href} className={`relative rounded-xl px-4 py-2 text-[13px] font-extrabold transition-all duration-300 ${pathname === href || pathname?.startsWith(`${href}/`) ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'}`}>{label}</Link>)}</nav>
        <form action="/products" className="mr-auto hidden min-w-0 max-w-[620px] flex-1 md:flex"><label className="flex h-12 w-full items-center rounded-2xl bg-slate-50 px-4 ring-1 ring-slate-200 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-600 focus-within:shadow-sm"><span className="text-slate-400"><SearchIcon/></span><input name="search" className="min-w-0 flex-1 bg-transparent px-3 text-[13px] font-medium text-slate-800 outline-none placeholder:text-slate-400" placeholder="جستجو در محصولات، برندها..." aria-label="جستجو"/></label></form>
        <div className="mr-auto flex items-center gap-2 lg:mr-0">
          <button type="button" onClick={() => setSearchOpen((v) => !v)} className="grid h-11 w-11 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-indigo-600 md:hidden" aria-label="جستجو"><SearchIcon/></button>
          <Link href={user ? '/account' : '/login'} className="grid h-11 w-11 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-indigo-600 sm:hidden" aria-label={user ? 'حساب کاربری' : 'ورود یا ثبت‌نام'}><UserIcon/></Link>
          {user ? <><Link href="/account" className="hidden h-11 items-center gap-2.5 rounded-xl px-4 text-[12px] font-extrabold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 sm:flex"><span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-indigo-600"><UserIcon/></span><span className="max-w-32 truncate">{user.name || user.email || 'حساب من'}</span></Link><button type="button" onClick={handleLogout} disabled={loggingOut} className="hidden px-3 text-[11px] font-bold text-slate-400 transition-colors hover:text-red-500 disabled:opacity-50 sm:block">{loggingOut ? '...' : 'خروج'}</button></> : <Link href="/login" className="hidden h-11 items-center gap-2 rounded-xl bg-slate-50 px-5 text-[12px] font-extrabold text-slate-700 transition-all hover:bg-indigo-50 hover:text-indigo-700 sm:flex"><UserIcon/>ورود / ثبت‌نام</Link>}
          <Link href="/cart" className="grid h-11 w-11 place-items-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-indigo-600" aria-label="سبد خرید"><CartIcon/></Link>
        </div>
      </div>
      {searchOpen && <div className="border-t border-slate-100 py-3 md:hidden"><form action="/products" className="flex h-12 items-center rounded-xl bg-slate-50 px-4 ring-1 ring-slate-200"><span className="text-slate-400"><SearchIcon/></span><input autoFocus name="search" className="min-w-0 flex-1 bg-transparent px-3 text-[13px] outline-none placeholder:text-slate-400" placeholder="جستجوی محصول، برند..." aria-label="جستجو"/></form></div>}
      <nav className="flex gap-2 overflow-x-auto border-t border-slate-100 py-3 lg:hidden" aria-label="ناوبری موبایل">{navItems.map(([label, href]) => <Link key={href} href={href} className={`shrink-0 rounded-lg px-4 py-2 text-[11px] font-extrabold transition-colors ${pathname === href || pathname?.startsWith(`${href}/`) ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}>{label}</Link>)}</nav>
    </div>
  </header>;
}
