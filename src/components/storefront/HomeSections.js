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
    <div className="pb-10">
      <section className="store-shell pt-5 sm:pt-7">
        <div className="relative min-h-[430px] overflow-hidden bg-[#f0eee8] px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
          <div className="relative z-10 max-w-[620px]">
            <span className="inline-flex items-center border border-[#d9d5ca] bg-white/70 px-3 py-1.5 text-xs font-bold text-slate-600">فروشگاه ایرانی، تجربه‌ای تازه</span>
            <h1 className="mt-7 text-4xl font-black leading-[1.25] tracking-tight text-[#181818] sm:text-5xl lg:text-6xl">خرید خوب،<br /><span className="text-[var(--brand)]">ساده و مطمئن.</span></h1>
            <p className="mt-6 max-w-[520px] text-sm leading-8 text-[#5f5d58] sm:text-base">محصولات موردنظرتان را پیدا کنید، قیمت‌ها را مقایسه کنید و خرید را بدون شلوغی و پیچیدگی انجام دهید.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/products" className="inline-flex h-12 items-center bg-[#181818] px-6 text-sm font-bold text-white transition hover:bg-black">مشاهده محصولات</Link>
              <Link href="/categories" className="inline-flex h-12 items-center border border-[#d7d3ca] bg-white/70 px-6 text-sm font-bold text-[#30302e] transition hover:bg-white">دسته‌بندی‌ها</Link>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[52%] lg:block">
            <div className="absolute left-14 top-10 h-64 w-52 rotate-[-7deg] border border-white/80 bg-white/70 p-3 shadow-2xl shadow-black/10">
              {heroProducts[0] ? <img src={heroProducts[0].primary_image_url || heroProducts[0].image_url} alt="" className="h-full w-full object-contain" /> : null}
            </div>
            <div className="absolute bottom-[-24px] left-52 h-72 w-56 rotate-[6deg] border border-white/80 bg-white p-3 shadow-2xl shadow-black/10">
              {heroProducts[1] ? <img src={heroProducts[1].primary_image_url || heroProducts[1].image_url} alt="" className="h-full w-full object-contain" /> : null}
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="store-shell pt-14">
          <div className="flex items-end justify-between border-b border-[var(--border)] pb-4">
            <div><p className="text-xs font-bold text-[var(--brand)]">سریع‌تر پیدا کنید</p><h2 className="mt-1 text-2xl font-black">دسته‌بندی‌های محبوب</h2></div>
            <Link href="/categories" className="text-sm font-bold text-slate-500 hover:text-[var(--brand)]">همه دسته‌ها ←</Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`} className="group bg-white px-4 py-6 text-center transition hover:bg-[#fbfaf7]">
                <div className="mx-auto grid h-16 w-16 place-items-center border border-[#e9e6df] bg-[#f7f6f2] text-xl font-black text-slate-400 transition group-hover:border-rose-200 group-hover:bg-[var(--brand-soft)] group-hover:text-[var(--brand)]">{category.name?.slice(0, 1)}</div>
                <p className="mt-4 line-clamp-2 text-xs font-bold leading-5 text-slate-700">{category.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="store-shell pt-14">
          <div className="flex items-end justify-between border-b border-[var(--border)] pb-4">
            <div><p className="text-xs font-bold text-[var(--brand)]">تازه واردها</p><h2 className="mt-1 text-2xl font-black">جدیدترین محصولات</h2></div>
            <Link href="/products" className="text-sm font-bold text-slate-500 hover:text-[var(--brand)]">مشاهده همه ←</Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

      <section className="store-shell pt-14">
        <div className="grid border-y border-[var(--border)] bg-white sm:grid-cols-3">
          {[['ارسال شفاف', 'هزینه و روش ارسال را قبل از خرید بدانید.'], ['پرداخت امن', 'فرآیند پرداخت ساده و قابل پیگیری است.'], ['پشتیبانی', 'اطلاعات سفارش و حساب شما همیشه در دسترس است.']].map(([title, text], index) => (
            <div key={title} className={`px-6 py-7 ${index < 2 ? 'border-b border-[var(--border)] sm:border-b-0 sm:border-l' : ''}`}>
              <p className="text-sm font-black">{title}</p><p className="mt-2 text-xs leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
