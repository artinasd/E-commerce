'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
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
      router.push('/');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border)]/90 bg-white/90 backdrop-blur-xl">
        <div className="store-shell">
          <div className="flex min-h-[72px] items-center gap-3 sm:gap-5">
            <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="صفحه اصلی">
              <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[var(--brand)] text-lg font-black text-white shadow-[0_8px_22px_rgba(225,29,72,.22)] transition group-hover:scale-[1.04]">ف</span>
              <span className="hidden text-[18px] font-black tracking-[-.04em] sm:block">فروشگاه</span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="ناوبری اصلی">
              {[['محصولات', '/products'], ['دسته‌بندی‌ها', '/categories'], ['برندها', '/brands']].map(([label, href]) => (
                <Link key={href} href={href} className="rounded-[10px] px-3.5 py-2 text-[13px] font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950">{label}</Link>
              ))}
            </nav>

            <form action="/products" className="mr-auto hidden min-w-0 max-w-[610px] flex-1 md:flex">
              <label className="flex h-12 w-full items-center rounded-[14px] bg-[var(--surface-soft)] px-4 transition focus-within:bg-white focus-within:ring-1 focus-within:ring-[var(--border-strong)] focus-within:shadow-[0_8px_30px_rgba(23,23,23,.06)]">
                <span className="ml-3 text-lg text-slate-400" aria-hidden="true">⌕</span>
                <input name="search" className="min-w-0 flex-1 bg-transparent text-[13px] font-medium outline-none" placeholder="جستجو در میان محصولات، برندها و دسته‌بندی‌ها" aria-label="جستجو" />
              </label>
            </form>

            <div className="mr-auto flex items-center gap-2 lg:mr-0">
              <button type="button" onClick={() => setSearchOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-[12px] border border-[var(--border)] bg-white text-lg text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 md:hidden" aria-label="باز کردن جستجو">⌕</button>
              {user ? (
                <>
                  <Link href="/account" className="hidden h-11 max-w-44 items-center gap-2 rounded-[12px] border border-[var(--border)] bg-white px-4 text-[12px] font-bold transition hover:border-slate-300 hover:bg-slate-50 sm:inline-flex">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-[11px] text-slate-600">{(user.name || user.email || 'ح').slice(0, 1)}</span>
                    <span className="truncate">{user.name || user.email || 'حساب کاربری'}</span>
                  </Link>
                  <button type="button" onClick={handleLogout} disabled={loggingOut} className="hidden h-11 rounded-[12px] px-3 text-[12px] font-bold text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 sm:inline-flex sm:items-center">{loggingOut ? '…' : 'خروج'}</button>
                </>
              ) : (
                <Link href="/login" className="hidden h-11 items-center rounded-[12px] border border-[var(--border)] bg-white px-4 text-[12px] font-bold transition hover:border-slate-300 hover:bg-slate-50 sm:inline-flex">ورود / ثبت‌نام</Link>
              )}
              <Link href="/cart" className="relative grid h-11 w-11 place-items-center rounded-[12px] border border-[var(--border)] bg-white text-lg transition hover:border-slate-300 hover:bg-slate-50" aria-label="سبد خرید">🛒</Link>
            </div>
          </div>
          {searchOpen && (
            <div className="border-t border-[var(--border)] py-3 md:hidden">
              <form action="/products"><input autoFocus name="search" className="h-11 w-full rounded-[12px] border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm outline-none focus:bg-white" placeholder="جستجوی محصول، برند یا دسته‌بندی" aria-label="جستجو" /></form>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
