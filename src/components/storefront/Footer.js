import Link from 'next/link';

const Arrow = () => <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5 fill-none stroke-current stroke-2"><path d="m7 4 5 6-5 6" /></svg>;

export default function Footer() {
  return (
    <footer dir="rtl" className="mt-20 border-t border-[var(--border)] bg-white">
      <div className="store-shell pt-12 sm:pt-16">
        <div className="relative overflow-hidden border border-[var(--border)] bg-[#fafaf8] p-6 sm:p-8 lg:p-10">
          <div className="absolute -left-16 -top-20 h-48 w-48 rounded-full bg-[var(--brand)]/[0.045] blur-2xl" />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-[12px] bg-[var(--brand)] text-lg font-black text-white shadow-[0_8px_22px_rgba(225,29,72,.16)]">ف</span><div><p className="text-[9px] font-black text-[var(--brand)]">فروشگاهی که ساده می‌ماند</p><h2 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">خرید خوب، بدون شلوغی اضافه.</h2></div></div>
              <p className="mt-4 text-[10px] font-medium leading-7 text-slate-500 sm:text-[11px]">محصول مناسب را سریع پیدا کنید، سفارش‌ها را مدیریت کنید و تجربه خریدی روان و فارسی داشته باشید.</p>
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap"><Link href="/products" className="inline-flex items-center justify-center gap-2 bg-[var(--brand)] px-5 py-3 text-[9px] font-black text-white transition hover:opacity-90">مشاهده محصولات <Arrow /></Link><Link href="/categories" className="inline-flex items-center justify-center gap-2 border border-[var(--border)] bg-white px-5 py-3 text-[9px] font-black transition hover:border-slate-300">دسته‌بندی‌ها <Arrow /></Link></div>
          </div>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.55fr_.75fr_.9fr] lg:py-14">
          <div><div className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[var(--brand)] text-sm font-black text-white">ف</span><p className="text-base font-black">فروشگاه</p></div><p className="mt-4 max-w-md text-[11px] font-medium leading-7 text-slate-500">یک تجربه خرید فارسی، سریع و خلوت؛ با تمرکز روی پیدا کردن محصول مناسب و خریدی بدون اصطکاک.</p><div className="mt-6 flex flex-wrap gap-2"><span className="border border-[var(--border)] bg-[#fafaf8] px-3 py-2 text-[8px] font-black text-slate-500">خرید امن</span><span className="border border-[var(--border)] bg-[#fafaf8] px-3 py-2 text-[8px] font-black text-slate-500">پشتیبانی سفارش</span><span className="border border-[var(--border)] bg-[#fafaf8] px-3 py-2 text-[8px] font-black text-slate-500">ارسال قابل پیگیری</span></div></div>
          <div><h2 className="text-[10px] font-black text-slate-950">دسترسی سریع</h2><div className="mt-5 grid gap-3 text-[10px] font-medium text-slate-500"><Link href="/products" className="transition hover:text-[var(--brand)]">همه محصولات</Link><Link href="/categories" className="transition hover:text-[var(--brand)]">دسته‌بندی‌ها</Link><Link href="/brands" className="transition hover:text-[var(--brand)]">برندها</Link><Link href="/account" className="transition hover:text-[var(--brand)]">حساب کاربری</Link><Link href="/cart" className="transition hover:text-[var(--brand)]">سبد خرید</Link></div></div>
          <div><h2 className="text-[10px] font-black text-slate-950">خدمات مشتریان</h2><p className="mt-5 text-[10px] font-medium leading-7 text-slate-500">پیگیری سفارش، مدیریت آدرس‌ها و مشاهده سابقه خرید از داخل حساب کاربری.</p><Link href="/orders" className="mt-4 inline-flex text-[10px] font-black text-[var(--brand)] hover:underline">پیگیری سفارش‌ها ←</Link></div>
        </div>
      </div>
      <div className="border-t border-[var(--border)]"><div className="store-shell flex flex-col gap-2 py-5 text-[9px] font-medium text-slate-400 sm:flex-row sm:items-center sm:justify-between"><span>تمامی حقوق محفوظ است.</span><span>طراحی شده برای یک خرید ساده و سریع</span></div></div>
    </footer>
  );
}
