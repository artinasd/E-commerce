import Link from 'next/link';

const Arrow = () => <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5 fill-none stroke-current stroke-2"><path d="m7 4 5 6-5 6" /></svg>;

export default function Footer() {
  return (
    <footer dir="rtl" className="mt-20 border-t border-slate-200 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="store-shell pt-12 sm:pt-16">
        <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl shadow-indigo-100/50 ring-1 ring-slate-100 sm:p-8 lg:p-10">
          <div className="absolute -left-16 -top-20 h-48 w-48 rounded-full bg-indigo-600/5 blur-3xl" />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-[14px] bg-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-200">ف</span><div><p className="text-[10px] font-black tracking-wide text-indigo-600">فروشگاهی که ساده می‌ماند</p><h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">خرید خوب، بدون شلوغی اضافه.</h2></div></div>
              <p className="mt-4 text-[11px] font-medium leading-7 text-slate-600 sm:text-[12px]">محصول مناسب را سریع پیدا کنید، سفارش‌ها را مدیریت کنید و تجربه خریدی روان و فارسی داشته باشید.</p>
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-3 sm:flex sm:flex-wrap"><Link href="/products" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-[11px] font-black text-white shadow-md shadow-indigo-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700">مشاهده محصولات <Arrow /></Link><Link href="/categories" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-50 px-6 text-[11px] font-black text-slate-700 ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100">دسته‌بندی‌ها <Arrow /></Link></div>
          </div>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.55fr_.75fr_.9fr] lg:py-16">
          <div><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-sm font-black text-white shadow-sm">ف</span><p className="text-base font-black text-slate-800">فروشگاه</p></div><p className="mt-5 max-w-md text-[12px] font-medium leading-7 text-slate-600">یک تجربه خرید فارسی، سریع و خلوت؛ با تمرکز روی پیدا کردن محصول مناسب و خریدی بدون اصطکاک.</p><div className="mt-7 flex flex-wrap gap-2.5"><span className="rounded-lg bg-white px-3.5 py-2 text-[10px] font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">خرید امن</span><span className="rounded-lg bg-white px-3.5 py-2 text-[10px] font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">پشتیبانی سفارش</span><span className="rounded-lg bg-white px-3.5 py-2 text-[10px] font-bold text-slate-600 shadow-sm ring-1 ring-slate-200">ارسال قابل پیگیری</span></div></div>
          <div><h2 className="text-[12px] font-black text-slate-900">دسترسی سریع</h2><div className="mt-6 grid gap-4 text-[11px] font-medium text-slate-600"><Link href="/products" className="transition-colors hover:text-indigo-600">همه محصولات</Link><Link href="/categories" className="transition-colors hover:text-indigo-600">دسته‌بندی‌ها</Link><Link href="/brands" className="transition-colors hover:text-indigo-600">برندها</Link><Link href="/account" className="transition-colors hover:text-indigo-600">حساب کاربری</Link><Link href="/cart" className="transition-colors hover:text-indigo-600">سبد خرید</Link></div></div>
          <div><h2 className="text-[12px] font-black text-slate-900">خدمات مشتریان</h2><p className="mt-6 text-[11px] font-medium leading-7 text-slate-600">پیگیری سفارش، مدیریت آدرس‌ها و مشاهده سابقه خرید از داخل حساب کاربری.</p><Link href="/orders" className="mt-5 inline-flex items-center gap-1 text-[11px] font-black text-indigo-600 transition-colors hover:text-indigo-700 hover:underline">پیگیری سفارش‌ها ←</Link></div>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-white"><div className="store-shell flex flex-col gap-3 py-6 text-[10px] font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>تمامی حقوق محفوظ است.</span><span>طراحی شده برای یک خرید ساده و سریع</span></div></div>
    </footer>
  );
}
