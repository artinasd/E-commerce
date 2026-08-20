import Image from 'next/image';
import Link from 'next/link';
import ProductCard from './ProductCard';
import HeroProductShowcase from './HeroProductShowcase';
import { getCategories, getProducts } from '../../server/catalog/service.js';

export default async function HomeSections() {
  let products = [];
  let categories = [];
  try {
    const [productResult, categoryResult] = await Promise.all([
      getProducts({ page: 1, limit: 16, sort: 'created_at', direction: 'desc' }),
      getCategories(),
    ]);
    products = Array.isArray(productResult?.products) ? productResult.products : [];
    categories = Array.isArray(categoryResult) ? categoryResult.slice(0, 8) : [];
  } catch {
    // Keep the homepage renderable if the catalog is temporarily unavailable.
  }

  const featuredProducts = products.slice(0, 8);
  const moreProducts = products.slice(8, 16);

  return <div className="pb-20">
    <section className="store-shell pt-4 sm:pt-6">
      <div className="relative grid overflow-hidden border border-[var(--border)] bg-[#f0ede6] lg:grid-cols-[1.02fr_.98fr]">
        <div className="relative z-10 flex items-center px-6 py-9 sm:px-10 lg:px-14 lg:py-11">
          <div className="max-w-[620px]">
            <p className="text-[12px] font-black tracking-wide text-[var(--brand)]">فروشگاه آنلاین شما</p>
            <h1 className="mt-4 text-[39px] font-black leading-[1.2] tracking-[-.055em] text-[#151515] sm:text-5xl lg:text-[58px]">
              انتخاب خوب،<br/>
              <span className="text-[var(--brand)]">ساده‌تر از همیشه.</span>
            </h1>
            <p className="mt-5 max-w-[520px] text-[15px] font-medium leading-8 text-[#62605b]">
              محصولات منتخب، قیمت‌های شفاف و تجربه‌ای سریع و آرام برای خرید روزمره شما.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                  href="/products"
                  className="inline-flex h-12 items-center bg-white border-2 border-[var(--brand)] px-8 text-[14px] font-black text-[var(--brand)] transition hover:bg-[var(--brand)] hover:text-white"
              >
                مشاهده محصولات
              </Link>
              <Link
                  href="/products"
                  className="inline-flex h-12 items-center border border-[#d1ccc1] bg-white/70 px-8 text-[14px] font-black text-[#292929] transition hover:bg-white"
              >
                دسته‌بندی‌ها
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-7 border-t border-[#d7d1c5] pt-4 text-[11px] font-bold text-slate-500">
              <span><b className="text-slate-900">سریع</b> · تجربه سبک</span>
              <span><b className="text-slate-900">شفاف</b> · قیمت و ارسال</span>
              <span><b className="text-slate-900">مطمئن</b> · پیگیری سفارش</span>
            </div>
          </div>
        </div>
        <div className="relative min-h-[300px] overflow-hidden bg-[#e8e3d8] sm:min-h-[370px] lg:min-h-[440px]"><HeroProductShowcase products={products}/></div>
      </div>
    </section>

    {featuredProducts.length > 0 ? <section className="store-shell pt-9 sm:pt-11"><div className="mb-5 flex items-end justify-between border-b border-[var(--border)] pb-4"><div><p className="text-[11px] font-black text-[var(--brand)]">ویترین فروشگاه</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">محبوب‌های این روزها</h2><p className="mt-1 text-[12px] text-slate-400">چند انتخاب از محصولات موجود فروشگاه.</p></div><Link href="/products" className="text-[12px] font-extrabold text-slate-400 hover:text-[var(--brand)]">مشاهده همه ←</Link></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{featuredProducts.map((product) => <ProductCard key={product.id} product={product}/>)}</div></section> : <section className="store-shell pt-9 sm:pt-11"><div className="border-y border-[var(--border)] bg-white px-6 py-10 text-center"><h2 className="text-xl font-black">ویترین فروشگاه در حال آماده‌سازی است</h2><p className="mx-auto mt-2 max-w-lg text-[13px] leading-7 text-slate-500">هنوز محصول فعالی برای نمایش در فروشگاه ثبت نشده است. به‌محض اضافه شدن محصولات، اینجا نمایش داده می‌شوند.</p><Link href="/products" className="mt-5 inline-flex h-11 items-center bg-slate-950 px-6 text-[12px] font-black text-white hover:bg-[var(--brand)]">رفتن به فروشگاه</Link></div></section>}

    {categories.length > 0 && <section className="store-shell pt-11 sm:pt-13"><div className="flex items-end justify-between border-b border-[var(--border)] pb-4"><div><p className="text-[11px] font-black text-[var(--brand)]">انتخاب سریع</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">دسته‌بندی‌های محبوب</h2></div><Link href="/products" className="text-[12px] font-extrabold text-slate-400 hover:text-[var(--brand)]">مشاهده همه ←</Link></div><div className="mt-4 grid grid-cols-2 gap-x-1 sm:grid-cols-4 lg:grid-cols-8">{categories.map((category) => <Link key={category.id} href={`/products?category=${encodeURIComponent(category.slug)}`} className="group border-b border-[var(--border)] px-3 py-5 text-center transition hover:bg-white"><div className="relative mx-auto h-24 w-24 overflow-hidden bg-[var(--surface-soft)] text-base font-black text-slate-500 transition group-hover:bg-[var(--brand-soft)] group-hover:text-[var(--brand)]">{category.image_url ? <Image src={category.image_url} alt="" fill sizes="96px" unoptimized className="object-cover transition duration-300 group-hover:scale-105"/> : <span className="grid h-full w-full place-items-center">{category.name?.slice(0,1)}</span>}</div><p className="mt-3 line-clamp-2 text-[12px] font-extrabold leading-5 text-slate-700">{category.name}</p></Link>)}</div></section>}

    {moreProducts.length > 0 && <section className="store-shell pt-11 sm:pt-13"><div className="mb-5 flex items-end justify-between border-b border-[var(--border)] pb-4"><div><p className="text-[11px] font-black text-[var(--brand)]">بیشتر برای دیدن</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">تازه‌های فروشگاه</h2></div><Link href="/products" className="text-[12px] font-extrabold text-slate-400 hover:text-[var(--brand)]">همه محصولات ←</Link></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{moreProducts.map((product) => <ProductCard key={product.id} product={product}/>)}</div></section>}

    <section className="store-shell pt-11 sm:pt-13"><div className="grid border-y border-[var(--border)] bg-white sm:grid-cols-3">{[['ارسال شفاف','روش و هزینه ارسال را قبل از ثبت سفارش می‌بینی.'],['پرداخت آماده','وضعیت سفارش و پرداخت را ساده پیگیری می‌کنی.'],['پشتیبانی خرید','حساب، آدرس‌ها و خریدها همیشه در دسترس هستند.']].map(([title,text],i)=><div key={title} className={`px-6 py-8 sm:px-7 ${i<2?'border-b border-[var(--border)] sm:border-b-0 sm:border-l':''}`}><p className="text-[14px] font-black">{title}</p><p className="mt-2 text-[12px] font-medium leading-7 text-slate-500">{text}</p></div>)}</div></section>
  </div>;
}
