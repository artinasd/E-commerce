'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((result) => { if (active) setUser(result?.data?.user ?? null); })
      .catch(() => { if (active) setUser(null); });
    return () => { active = false; };
  }, []);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout failed');
      window.location.href = '/';
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/95 backdrop-blur-xl">
      <div className="store-shell">
        <div className="flex h-[76px] items-center gap-3">
          <button type="button" onClick={() => setSearchOpen((v) => !v)} className="grid h-11 w-11 place-items-center border border-[var(--border)] bg-white text-lg text-slate-700 lg:hidden" aria-label="باز کردن جستجو">☰</button>
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="صفحه اصلی">
            <span className="grid h-11 w-11 place-items-center bg-[var(--brand)] text-xl font-black text-white shadow-sm">ف</span>
            <span className="hidden text-xl font-black tracking-tight sm:block">فروشگاه</span>
          </Link>
          <nav className="hidden items-center gap-7 pr-6 text-[13px] font-semibold text-slate-600 lg:flex" aria-label="ناوبری اصلی">
            <Link className="relative py-7 hover:text-[var(--foreground)]" href="/products">محصولات</Link>
            <Link className="relative py-7 hover:text-[var(--foreground)]" href="/categories">دسته‌بندی‌ها</Link>
            <Link className="relative py-7 hover:text-[var(--foreground)]" href="/brands">برندها</Link>
          </nav>
          <form action="/products" className="mr-auto hidden min-w-0 max-w-[560px] flex-1 md:flex">
            <label className="flex h-12 w-full items-center border border-transparent bg-[#f3f3f1] px-4 transition focus-within:border-slate-200 focus-within:bg-white focus-within:shadow-sm">
              <span className="ml-3 text-xl text-slate-400" aria-hidden="true">⌕</span>
              <input name="search" className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="جستجو در میان هزاران محصول و برند" aria-label="جستجو" />
            </label>
          </form>
          <div className="mr-auto flex items-center gap-1.5 lg:mr-0">
            {user ? (
              <>
                <Link href="/account" className="hidden h-11 max-w-40 items-center gap-2 truncate border border-[var(--border)] bg-white px-4 text-[13px] font-bold transition hover:border-slate-300 hover:bg-slate-50 sm:inline-flex">{user.name || user.email || 'حساب کاربری'}</Link>
                <button type="button" onClick={handleLogout} disabled={loggingOut} className="hidden h-11 items-center border border-red-200 bg-white px-4 text-[13px] font-bold text-red-600 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-wait disabled:opacity-60 sm:inline-flex">{loggingOut ? 'در حال خروج…' : 'خروج'}</button>
              </>
            ) : (
              <Link href="/login" className="hidden h-11 items-center gap-2 border border-[var(--border)] bg-white px-4 text-[13px] font-bold transition hover:border-slate-300 hover:bg-slate-50 sm:inline-flex">ورود / ثبت‌نام</Link>
            )}
            <Link href="/cart" className="relative grid h-11 w-11 place-items-center border border-[var(--border)] bg-white text-lg transition hover:border-slate-300 hover:bg-slate-50" aria-label="سبد خرید">🛒</Link>
          </div>
        </div>
        {searchOpen && (
          <div className="border-t border-[var(--border)] py-3 md:hidden">
            <form action="/products"><input autoFocus name="search" className="h-11 w-full border border-[var(--border)] bg-[#f3f3f1] px-4 text-sm outline-none focus:bg-white" placeholder="جستجوی محصول، برند یا دسته‌بندی" aria-label="جستجو" /></form>
          </div>
        )}
      </div>
    </header>
  );
}
