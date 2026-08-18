import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-white">
      <div className="store-shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:py-14">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-[12px] bg-[var(--brand)] text-lg font-black text-white">ف</span>
            <p className="text-lg font-black tracking-tight">فروشگاه</p>
          </div>
          <p className="mt-5 max-w-md text-[12px] font-medium leading-8 text-slate-500">یک تجربه خرید فارسی، سریع و خلوت؛ با تمرکز روی پیدا کردن محصول مناسب و خریدی بدون اصطکاک.</p>
        </div>
        <div>
          <h2 className="text-[12px] font-black">دسترسی سریع</h2>
          <div className="mt-4 grid gap-3 text-[12px] font-medium text-slate-500">
            <Link href="/products" className="transition hover:text-[var(--brand)]">همه محصولات</Link>
            <Link href="/categories" className="transition hover:text-[var(--brand)]">دسته‌بندی‌ها</Link>
            <Link href="/brands" className="transition hover:text-[var(--brand)]">برندها</Link>
            <Link href="/account" className="transition hover:text-[var(--brand)]">حساب کاربری</Link>
          </div>
        </div>
        <div>
          <h2 className="text-[12px] font-black">خدمات مشتریان</h2>
          <p className="mt-4 text-[12px] font-medium leading-7 text-slate-500">پیگیری سفارش، مدیریت آدرس‌ها و مشاهده سابقه خرید از داخل حساب کاربری.</p>
        </div>
      </div>
      <div className="border-t border-[var(--border)]">
        <div className="store-shell py-5 text-[10px] font-medium text-slate-400">تمامی حقوق محفوظ است.</div>
      </div>
    </footer>
  );
}
