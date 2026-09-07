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

  return <div className="pb-20 bg-slate-50">
    <section className="store-shell pt-4 sm:pt-6">
      <div className="relative grid overflow-hidden rounded-3xl bg-gradient-to-br from-[#f8f7f4] to-[#edeadd] shadow-xl shadow-indigo-100/50 lg:grid-cols-[1.02fr_.98fr]">
        <div className="relative z-10 flex items-center px-6 py-9 sm:px-10 lg:px-14 lg:py-11">
          <div className="max-w-[620px]">
            <p className="text-[12px] font-black tracking-wide text-indigo-600">فروشگاه آنلاین شما</p>
            <h1 className="mt-4 text-[39px] font-black leading-[1.2] tracking-[-.055em] text-slate-900 sm:text-5xl lg:text-[58px]">
              انتخاب خوب،<br/>
              <span className="text-indigo-600 drop-shadow-sm">ساده‌تر از همیشه.</span>
            </h1>
            <p className="mt-5 max-w-[520px] text-[15px] font-medium leading-8 text-slate-600">
              محصولات منتخب، قیمت‌های شفاف و تجربه‌ای سریع و آرام برای خرید روزمره شما.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                  href="/products"
                  className="inline-flex h-12 items-center rounded-2xl bg-indigo-600 px-8 text-[14px] font-black text-white shadow-lg shadow-indigo-200 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-indigo-300"
              >
                مشاهده محصولات
              </Link>
              <Link
                  href="/products"
                  className="inline-flex h-12 items-center rounded-2xl bg-white/70 px-8 text-[14px] font-black text-slate-800 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white"
              >
                دسته‌بندی‌ها
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-7 border-t border-slate-300/50 pt-4 text-[11px] font-bold text-slate-500">
              <span><b className="text-slate-900">سریع</b> · تجربه سبک</span>
              <span><b className="text-slate-900">شفاف</b> · قیمت و ارسال</span>
              <span><b className="text-slate-900">مطمئن</b> · پیگیری سفارش</span>
            </div>
          </div>
        </div>
        <div className="relative min-h-[300px] overflow-hidden rounded-l-3xl bg-slate-200/50 sm:min-h-[370px] lg:min-h-[440px]"><HeroProductShowcase products={products}/></div>
      </div>
    </section>

    {featuredProducts.length > 0 ? <section className="store-shell pt-10 sm:pt-14"><div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4"><div><p className="text-[11px] font-black text-indigo-600">ویترین فروشگاه</p><h2 className="mt-1 text-2xl font-black sm:text-3xl text-slate-800">محبوب‌های این روزها</h2><p className="mt-1 text-[12px] text-slate-400">چند انتخاب از محصولات موجود فروشگاه.</p></div><Link href="/products" className="text-[12px] font-extrabold text-slate-400 transition-colors hover:text-indigo-600">مشاهده همه ←</Link></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{featuredProducts.map((product) => <ProductCard key={product.id} product={product}/>)}</div></section> : <section className="store-shell pt-10 sm:pt-14"><div className="rounded-3xl bg-white px-6 py-12 text-center shadow-xl shadow-indigo-100/30"><h2 className="text-xl font-black text-slate-800">ویترین فروشگاه در حال آماده‌سازی است</h2><p className="mx-auto mt-3 max-w-lg text-[13px] leading-7 text-slate-500">هنوز محصول فعالی برای نمایش در فروشگاه ثبت نشده است. به‌محض اضافه شدن محصولات، اینجا نمایش داده می‌شوند.</p><Link href="/products" className="mt-6 inline-flex h-11 items-center rounded-2xl bg-slate-900 px-6 text-[12px] font-black text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-600">رفتن به فروشگاه</Link></div></section>}

    {categories.length > 0 && <section className="store-shell pt-12 sm:pt-16"><div className="flex items-end justify-between border-b border-slate-200 pb-4"><div><p className="text-[11px] font-black text-indigo-600">انتخاب سریع</p><h2 className="mt-1 text-2xl font-black sm:text-3xl text-slate-800">دسته‌بندی‌های محبوب</h2></div><Link href="/products" className="text-[12px] font-extrabold text-slate-400 transition-colors hover:text-indigo-600">مشاهده همه ←</Link></div><div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">{categories.map((category) => <Link key={category.id} href={`/products?category=${encodeURIComponent(category.slug)}`} className="group flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/50"><div className="relative h-24 w-24 overflow-hidden rounded-full bg-slate-100 text-base font-black text-slate-500 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">{category.image_url ? <Image src={category.image_url} alt="" fill sizes="96px" unoptimized className="object-cover transition duration-500 group-hover:scale-110"/> : <span className="grid h-full w-full place-items-center">{category.name?.slice(0,1)}</span>}</div><p className="mt-4 text-center text-[13px] font-extrabold leading-5 text-slate-700 transition-colors group-hover:text-indigo-600">{category.name}</p></Link>)}</div></section>}

    {moreProducts.length > 0 && <section className="store-shell pt-12 sm:pt-16"><div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4"><div><p className="text-[11px] font-black text-indigo-600">بیشتر برای دیدن</p><h2 className="mt-1 text-2xl font-black sm:text-3xl text-slate-800">تازه‌های فروشگاه</h2></div><Link href="/products" className="text-[12px] font-extrabold text-slate-400 transition-colors hover:text-indigo-600">همه محصولات ←</Link></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{moreProducts.map((product) => <ProductCard key={product.id} product={product}/>)}</div></section>}

    <section className="store-shell pt-12 sm:pt-16"><div className="grid overflow-hidden rounded-3xl bg-white shadow-xl shadow-indigo-100/30 sm:grid-cols-3">{[['ارسال شفاف','روش و هزینه ارسال را قبل از ثبت سفارش می‌بینی.'],['پرداخت آماده','وضعیت سفارش و پرداخت را ساده پیگیری می‌کنی.'],['پشتیبانی خرید','حساب، آدرس‌ها و خریدها همیشه در دسترس هستند.']].map(([title,text],i)=><div key={title} className={`p-8 text-center sm:p-10 ${i<2?'border-b border-slate-100 sm:border-b-0 sm:border-l':''}`}><p className="text-[15px] font-black text-slate-800">{title}</p><p className="mt-3 text-[13px] font-medium leading-7 text-slate-500">{text}</p></div>)}</div></section>
  </div>;
}
