/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import ProductCard from './ProductCard';

function getItems(payload, key) {
  if (!payload || !payload.ok) return [];
  return Array.isArray(payload.data?.[key]) ? payload.data[key] : [];
}

async function getJson(path) {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${base}${path}`, { next: { revalidate: 60 } });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export default async function HomeSections() {
  const [productsPayload, categoriesPayload] = await Promise.all([
    getJson('/api/products?limit=8&sort=created_at&direction=desc'),
    getJson('/api/categories?limit=8'),
  ]);

  const products = getItems(productsPayload, 'products');
  const categories = getItems(categoriesPayload, 'categories');
  const heroProducts = products.filter((p) => p.primary_image_url || p.image_url).slice(0, 2);

  return (
    <div className="pb-16">
      <section className="store-shell pt-5 sm:pt-7">
        <div className="relative overflow-hidden rounded-[28px] bg-[#eee9df] px-6 py-9 sm:px-10 sm:py-12 lg:min-h-[470px] lg:px-16 lg:py-16">
          <div className="absolute inset-y-0 left-0 hidden w-[48%] bg-[radial-gradient(circle_at_35%_45%,rgba(255,255,255,.9),transparent_55%)] lg:block" />
          <div className="relative z-10 max-w-[650px]">
            <span className="inline-flex rounded-full border border-[#d6d0c2] bg-white/75 px-3.5 py-2 text-[11px] font-black text-slate-600">تجربه‌ای تازه برای خرید آنلاین</span>
            <h1 className="mt-7 text-[42px] font-black leading-[1.22] tracking-[-.055em] text-[#171717] sm:text-6xl lg:text-[68px]">چیزی که می‌خواهی،<br /><span className="text-[var(--brand)]">همین‌جاست.</span></h1>
            <p className="mt-6 max-w-[560px] text-[13px] font-medium leading-8 text-[#62605b] sm:text-[15px]">محصولات را راحت پیدا کن، قیمت‌ها را مقایسه کن و با یک تجربه سریع و بی‌دردسر خریدت را کامل کن.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="inline-flex h-12 items-center rounded-[13px] bg-[#181818] px-7 text-[13px] font-black text-white transition hover:bg-black">شروع خرید</Link>
              <Link href="/categories" className="inline-flex h-12 items-center rounded-[13px] border border-[#d4cec1] bg-white/75 px-7 text-[13px] font-black text-[#30302e] transition hover:bg-white">مرور دسته‌بندی‌ها</Link>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[49%] lg:block">
            {heroProducts[0] && <div className="absolute left-12 top-12 h-64 w-52 -rotate-6 rounded-[22px] border border-white bg-white p-3 shadow-[0_28px_70px_rgba(23,23,23,.14)]"><img src={heroProducts[0].primary_image_url || heroProducts[0].image_url} alt="" className="h-full w-full object-contain" /></div>}
            {heroProducts[1] && <div className="absolute bottom-[-28px] left-52 h-72 w-56 rotate-6 rounded-[22px] border border-white bg-white p-3 shadow-[0_28px_70px_rgba(23,23,23,.14)]"><img src={heroProducts[1].primary_image_url || heroProducts[1].image_url} alt="" className="h-full w-full object-contain" /></div>}
          </div>
        </div>
      </section>

      {categories.length > 0 && <section className="store-shell pt-16">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-[11px] font-black text-[var(--brand)]">انتخاب سریع</p><h2 className="mt-1 text-2xl font-black tracking-tight">دسته‌بندی‌های محبوب</h2></div>
          <Link href="/categories" className="text-[12px] font-bold text-slate-500 transition hover:text-[var(--brand)]">مشاهده همه ←</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => <Link key={category.id} href={`/categories/${category.slug}`} className="group rounded-[18px] border border-[var(--border)] bg-white px-3 py-5 text-center transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_35px_rgba(23,23,23,.06)]"><div className="mx-auto grid h-14 w-14 place-items-center rounded-[16px] bg-[var(--surface-soft)] text-lg font-black text-slate-500 transition group-hover:bg-[var(--brand-soft)] group-hover:text-[var(--brand)]">{category.name?.slice(0, 1)}</div><p className="mt-3 line-clamp-2 text-[11px] font-extrabold leading-5 text-slate-700">{category.name}</p></Link>)}
        </div>
      </section>}

      {products.length > 0 && <section className="store-shell pt-16">
        <div className="flex items-end justify-between gap-4">
          <div><p className="text-[11px] font-black text-[var(--brand)]">تازه‌ترین‌ها</p><h2 className="mt-1 text-2xl font-black tracking-tight">محصولات جدید</h2></div>
          <Link href="/products" className="text-[12px] font-bold text-slate-500 transition hover:text-[var(--brand)]">مشاهده همه ←</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>}

      <section className="store-shell pt-16">
        <div className="grid overflow-hidden rounded-[22px] border border-[var(--border)] bg-white sm:grid-cols-3">
          {[['ارسال شفاف', 'روش و هزینه ارسال را قبل از پرداخت می‌بینی.'], ['پرداخت امن', 'پرداخت و وضعیت سفارش با خیال راحت پیگیری می‌شود.'], ['پشتیبانی', 'اطلاعات حساب و سفارش‌ها همیشه در دسترس توست.']].map(([title, text], index) => <div key={title} className={`px-6 py-7 ${index < 2 ? 'border-b border-[var(--border)] sm:border-b-0 sm:border-l' : ''}`}><p className="text-[13px] font-black">{title}</p><p className="mt-2 text-[11px] font-medium leading-6 text-slate-500">{text}</p></div>)}
        </div>
      </section>
    </div>
  );
}
