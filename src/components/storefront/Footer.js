import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="text-lg font-black text-[var(--brand)]">فروشگاه</p>
          <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">خرید آنلاین سریع، ساده و مطمئن با تجربه‌ای مدرن برای کاربران ایرانی.</p>
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">دسترسی سریع</h2>
          <div className="mt-3 grid gap-2 text-sm text-slate-500">
            <Link href="/products" className="hover:text-[var(--brand)]">همه محصولات</Link>
            <Link href="/categories" className="hover:text-[var(--brand)]">دسته‌بندی‌ها</Link>
            <Link href="/account" className="hover:text-[var(--brand)]">حساب کاربری</Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">خدمات مشتریان</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">پشتیبانی و پیگیری سفارش‌ها از طریق حساب کاربری.</p>
        </div>
      </div>
      <div className="border-t border-[var(--border)] px-4 py-5 text-center text-xs text-slate-400">تمامی حقوق محفوظ است.</div>
    </footer>
  );
}
