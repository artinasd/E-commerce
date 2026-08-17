import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[#181818] text-white">
      <div className="store-shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center bg-[var(--brand)] text-lg font-black">ف</span>
            <p className="text-lg font-black">فروشگاه</p>
          </div>
          <p className="mt-5 max-w-md text-sm leading-8 text-white/55">یک تجربه خرید فارسی، سریع و خلوت؛ با تمرکز روی پیدا کردن محصول مناسب و خریدی بدون اصطکاک.</p>
        </div>
        <div>
          <h2 className="text-sm font-bold">دسترسی سریع</h2>
          <div className="mt-4 grid gap-3 text-sm text-white/55">
            <Link href="/products" className="hover:text-white">همه محصولات</Link>
            <Link href="/categories" className="hover:text-white">دسته‌بندی‌ها</Link>
            <Link href="/brands" className="hover:text-white">برندها</Link>
            <Link href="/account" className="hover:text-white">حساب کاربری</Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold">خدمات مشتریان</h2>
          <p className="mt-4 text-sm leading-8 text-white/55">پیگیری سفارش، مدیریت آدرس‌ها و مشاهده سابقه خرید از داخل حساب کاربری.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="store-shell py-5 text-xs text-white/35">تمامی حقوق محفوظ است.</div>
      </div>
    </footer>
  );
}
