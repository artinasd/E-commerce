'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] text-slate-700 lg:hidden"
          aria-label="باز کردن منو"
          onClick={() => setSearchOpen((value) => !value)}
        >
          ☰
        </button>

        <Link href="/" className="shrink-0 text-xl font-black tracking-tight text-[var(--brand)]" aria-label="صفحه اصلی">
          فروشگاه
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex" aria-label="ناوبری اصلی">
          <Link className="transition hover:text-[var(--brand)]" href="/products">محصولات</Link>
          <Link className="transition hover:text-[var(--brand)]" href="/categories">دسته‌بندی‌ها</Link>
          <Link className="transition hover:text-[var(--brand)]" href="/brands">برندها</Link>
        </nav>

        <form action="/products" className="mx-auto hidden min-w-0 max-w-xl flex-1 md:flex">
          <label className="flex h-11 w-full items-center rounded-2xl bg-slate-100 px-4 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-[var(--brand)]/20">
            <span className="ml-3 text-slate-400" aria-hidden="true">⌕</span>
            <input name="search" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="جستجوی محصول، برند یا دسته‌بندی" aria-label="جستجو" />
          </label>
        </form>

        <div className="mr-auto flex items-center gap-2 lg:mr-0">
          <Link href="/account" className="hidden h-10 items-center rounded-xl px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex">ورود</Link>
          <Link href="/cart" className="relative inline-flex h-10 items-center justify-center rounded-xl border border-[var(--border)] px-3 text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50">سبد خرید</Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-[var(--border)] bg-white px-4 py-3 md:hidden">
          <form action="/products">
            <input autoFocus name="search" className="h-11 w-full rounded-xl bg-slate-100 px-4 outline-none focus:ring-2 focus:ring-[var(--brand)]/20" placeholder="جستجوی محصول، برند یا دسته‌بندی" aria-label="جستجو" />
          </form>
        </div>
      )}
    </header>
  );
}
