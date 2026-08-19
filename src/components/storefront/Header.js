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
  return <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/95 backdrop-blur-xl">
    <div className="store-shell">
      <div className="flex min-h-[76px] items-center gap-3 sm:min-h-[80px] sm:gap-4 lg:min-h-[84px] lg:gap-7">
        <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="صفحه اصلی"><span className="grid h-10 w-10 place-items-center rounded-[11px] bg-[var(--brand)] text-[16px] font-black text-white shadow-[0_7px_18px_rgba(225,29,72,.18)]">ف</span><span className="text-[20px] font-black tracking-[-.045em] sm:text-[21px]">فروشگاه</span></Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="ناوبری اصلی">{navItems.map(([label, href]) => <Link key={href} href={href} className={`relative px-3.5 py-2.5 text-[13px] font-extrabold transition ${pathname === href || pathname?.startsWith(`${href}/`) ? 'text-[var(--brand)]' : 'text-slate-600 hover:text-slate-950'}`}>{label}{(pathname === href || pathname?.startsWith(`${href}/`)) && <span className="absolute inset-x-3.5 -bottom-5 h-0.5 bg-[var(--brand)]"/>}</Link>)}</nav>
        <form action="/products" className="mr-auto hidden min-w-0 max-w-[620px] flex-1 md:flex"><label className="flex h-12 w-full items-center border-b border-[var(--border-strong)] transition focus-within:border-[var(--brand)]"><SearchIcon/><input name="search" className="min-w-0 flex-1 bg-transparent px-3.5 text-[13px] font-medium outline-none" placeholder="جستجو در محصولات، برندها و دسته‌بندی‌ها" aria-label="جستجو"/></label></form>
        <div className="mr-auto flex items-center gap-1.5 lg:mr-0">
          <button type="button" onClick={() => setSearchOpen((v) => !v)} className="grid h-11 w-11 place-items-center text-slate-500 transition hover:bg-[var(--surface-soft)] hover:text-slate-950 md:hidden" aria-label="جستجو"><SearchIcon/></button>
          <Link href={user ? '/account' : '/login'} className="grid h-11 w-11 place-items-center text-slate-600 transition hover:bg-[var(--surface-soft)] hover:text-slate-950 sm:hidden" aria-label={user ? 'حساب کاربری' : 'ورود یا ثبت‌نام'}><UserIcon/></Link>
          {user ? <><Link href="/account" className="hidden h-11 items-center gap-2 px-3 text-[12px] font-extrabold transition hover:bg-[var(--surface-soft)] sm:flex"><span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]"><UserIcon/></span><span className="max-w-32 truncate">{user.name || user.email || 'حساب من'}</span></Link><button type="button" onClick={handleLogout} disabled={loggingOut} className="hidden px-2.5 text-[11px] font-bold text-slate-400 hover:text-red-600 disabled:opacity-50 sm:block">{loggingOut ? '...' : 'خروج'}</button></> : <Link href="/login" className="hidden h-11 items-center gap-2 border border-[var(--border)] px-3.5 text-[12px] font-extrabold hover:border-slate-300 sm:flex"><UserIcon/>ورود / ثبت‌نام</Link>}
          <Link href="/cart" className="grid h-11 w-11 place-items-center text-slate-600 transition hover:bg-[var(--surface-soft)] hover:text-slate-950" aria-label="سبد خرید"><CartIcon/></Link>
        </div>
      </div>
      {searchOpen && <div className="border-t border-[var(--border)] py-3 md:hidden"><form action="/products" className="flex h-12 items-center border-b border-[var(--border-strong)]"><SearchIcon/><input autoFocus name="search" className="min-w-0 flex-1 bg-transparent px-3 text-[13px] outline-none" placeholder="جستجوی محصول، برند یا دسته‌بندی" aria-label="جستجو"/></form></div>}
      <nav className="flex gap-1 overflow-x-auto border-t border-[var(--border)] py-3 lg:hidden" aria-label="ناوبری موبایل">{navItems.map(([label, href]) => <Link key={href} href={href} className={`shrink-0 px-3.5 py-1.5 text-[11px] font-extrabold ${pathname === href || pathname?.startsWith(`${href}/`) ? 'text-[var(--brand)]' : 'text-slate-500'}`}>{label}</Link>)}</nav>
    </div>
  </header>;
}
