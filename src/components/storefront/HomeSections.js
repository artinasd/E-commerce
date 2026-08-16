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

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/75">تجربه تازه خرید آنلاین</span>
            <h1 className="mt-5 text-3xl font-black leading-[1.25] tracking-tight sm:text-5xl">هر چیزی که می‌خواهید،<br />ساده‌تر پیدا کنید.</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">جستجو کنید، مقایسه کنید و با یک تجربه سریع و شفاف خریدتان را کامل کنید.</p>
            <Link href="/products" className="mt-7 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-slate-950 transition hover:bg-slate-100">مشاهده محصولات</Link>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-xs font-bold text-[var(--brand)]">کشف سریع</p><h2 className="mt-1 text-xl font-black">دسته‌بندی‌ها</h2></div>
            <Link href="/categories" className="text-sm font-semibold text-slate-500 hover:text-[var(--brand)]">همه دسته‌ها ←</Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`} className="group rounded-2xl border border-[var(--border)] bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-lg font-black text-slate-400 group-hover:bg-red-50 group-hover:text-[var(--brand)]">{category.name?.slice(0, 1)}</div>
                <p className="mt-3 line-clamp-2 text-xs font-semibold leading-5 text-slate-700">{category.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-xs font-bold text-[var(--brand)]">تازه‌ترین انتخاب‌ها</p><h2 className="mt-1 text-xl font-black">محصولات جدید</h2></div>
            <Link href="/products" className="text-sm font-semibold text-slate-500 hover:text-[var(--brand)]">مشاهده همه ←</Link>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {[['ارسال مطمئن', 'سفارش شما با دقت آماده و پیگیری می‌شود.'], ['پرداخت امن', 'اطلاعات پرداخت شما با استانداردهای امنیتی محافظت می‌شود.'], ['پشتیبانی واقعی', 'در مسیر خرید تنها نیستید.']].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-[var(--border)] bg-white p-5">
              <h2 className="text-sm font-bold">{title}</h2><p className="mt-2 text-xs leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
