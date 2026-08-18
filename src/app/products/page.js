import Link from 'next/link';
import ProductCard from '../../components/storefront/ProductCard';

export const metadata = { title: 'محصولات' };

async function getProducts(searchParams) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value) query.set(key, value);
  }
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const response = await fetch(`${base}/api/products?${query.toString()}`, { cache: 'no-store' });
    if (!response.ok) return { products: [], pagination: null, failed: true };
    return { ...(await response.json()).data, failed: false };
  } catch {
    return { products: [], pagination: null, failed: true };
  }
}

function buildHref(params, changes = {}) {
  const next = new URLSearchParams(params);
  for (const [key, value] of Object.entries(changes)) {
    if (value) next.set(key, value); else next.delete(key);
  }
  return `/products${next.toString() ? `?${next.toString()}` : ''}`;
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const result = await getProducts(params);
  const products = result.products || [];
  const page = Number(params.page || 1);
  const hasMore = Boolean(result.pagination?.hasMore);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold text-[var(--brand)]">فروشگاه</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight">همه محصولات</h1>
          <p className="mt-2 text-sm text-slate-500">محصول موردنظرتان را پیدا کنید و با خیال راحت مقایسه کنید.</p>
        </div>
        <form className="flex flex-col gap-2 sm:flex-row" method="get">
          <input name="search" defaultValue={params.search || ''} placeholder="جستجوی محصول..." className="h-11 w-full rounded-xl border border-[var(--border)] bg-white px-4 text-sm outline-none focus:border-[var(--brand)] sm:w-72" />
          <select name="sort" defaultValue={params.sort || 'created_at'} className="h-11 rounded-xl border border-[var(--border)] bg-white px-3 text-sm outline-none">
            <option value="created_at">جدیدترین</option>
            <option value="price">قیمت</option>
            <option value="name">نام</option>
          </select>
          <input type="hidden" name="direction" value={params.sort === 'price' ? (params.direction === 'desc' ? 'desc' : 'asc') : 'desc'} />
          <button className="h-11 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-slate-800">جستجو</button>
        </form>
      </div>

      <div className="mt-8 flex flex-col gap-5 lg:flex-row">
        <aside className="w-full shrink-0 rounded-2xl border border-[var(--border)] bg-white p-4 lg:w-64">
          <div className="flex items-center justify-between"><h2 className="text-sm font-bold">فیلترها</h2><Link href="/products" className="text-xs font-semibold text-[var(--brand)]">حذف همه</Link></div>
          <form method="get" className="mt-5 space-y-5">
            {params.search ? <input type="hidden" name="search" value={params.search} /> : null}
            {params.category ? <input type="hidden" name="category" value={params.category} /> : null}
            {params.brand ? <input type="hidden" name="brand" value={params.brand} /> : null}
            <input type="hidden" name="sort" value={params.sort || 'created_at'} />
            <input type="hidden" name="direction" value={params.direction || 'desc'} />

            <div className="border-t border-[var(--border)] pt-4">
              <p className="text-xs font-bold text-slate-500">بازه قیمت (تومان)</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <input name="minPrice" inputMode="numeric" placeholder="از" defaultValue={params.minPrice || ''} className="h-10 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm outline-none focus:border-[var(--brand)]" />
                <input name="maxPrice" inputMode="numeric" placeholder="تا" defaultValue={params.maxPrice || ''} className="h-10 w-full rounded-lg border border-[var(--border)] bg-white px-3 text-sm outline-none focus:border-[var(--brand)]" />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 border-t border-[var(--border)] pt-4 text-sm font-semibold">
              <input type="checkbox" name="inStock" value="1" defaultChecked={['1', 'true', 'yes'].includes(String(params.inStock || '').toLowerCase())} className="h-4 w-4 accent-[var(--brand)]" />
              فقط کالاهای موجود
            </label>

            <div className="border-t border-[var(--border)] pt-4">
              <p className="text-xs font-bold text-slate-500">مرتب‌سازی</p>
              <div className="mt-2 grid gap-1 text-sm">
                <Link href={buildHref(params, { sort: 'created_at', direction: 'desc', page: '' })} className="rounded-lg px-3 py-2 hover:bg-slate-50">جدیدترین</Link>
                <Link href={buildHref(params, { sort: 'price', direction: 'asc', page: '' })} className="rounded-lg px-3 py-2 hover:bg-slate-50">ارزان‌ترین</Link>
                <Link href={buildHref(params, { sort: 'price', direction: 'desc', page: '' })} className="rounded-lg px-3 py-2 hover:bg-slate-50">گران‌ترین</Link>
                <Link href={buildHref(params, { sort: 'name', direction: 'asc', page: '' })} className="rounded-lg px-3 py-2 hover:bg-slate-50">نام: الف تا ی</Link>
              </div>
            </div>

            <button type="submit" className="h-10 w-full rounded-xl bg-slate-950 text-sm font-bold text-white transition hover:bg-slate-800">اعمال فیلترها</button>
          </form>
        </aside>

        <section className="min-w-0 flex-1">
          {result.failed ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center"><h2 className="font-bold text-red-900">دریافت محصولات ممکن نشد</h2><p className="mt-2 text-sm text-red-700">لطفاً کمی بعد دوباره تلاش کنید.</p></div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-[var(--border)] bg-white px-6 py-16 text-center"><h2 className="font-bold">محصولی پیدا نشد</h2><p className="mt-2 text-sm text-slate-500">عبارت جستجو یا فیلترهای خود را تغییر دهید.</p><Link href="/products" className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">نمایش همه محصولات</Link></div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between text-xs text-slate-500"><span>{result.pagination?.total || 0} محصول</span><span>صفحه {page}</span></div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
              <div className="mt-8 flex items-center justify-between">
                {page > 1 ? <Link href={buildHref(params, { page: String(page - 1) })} className="rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold">صفحه قبل</Link> : <span />}
                <span className="text-xs text-slate-400">صفحه {page}</span>
                {hasMore ? <Link href={buildHref(params, { page: String(page + 1) })} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">صفحه بعد</Link> : <span />}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
