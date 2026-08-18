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

function FilterChip({ href, active, children }) {
  return <Link href={href} className={`rounded-full border px-3.5 py-2 text-[11px] font-bold transition ${active ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]' : 'border-[var(--border)] bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900'}`}>{children}</Link>;
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const result = await getProducts(params);
  const products = result.products || [];
  const page = Number(params.page || 1);
  const hasMore = Boolean(result.pagination?.hasMore);

  return (
    <div className="store-shell py-7 sm:py-10">
      <section className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-white p-5 shadow-[0_16px_50px_rgba(23,23,23,.045)] sm:p-7 lg:p-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-black text-[var(--brand)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />فروشگاه</div>
            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">همه محصولات</h1>
            <p className="mt-2 max-w-xl text-[12px] leading-7 text-slate-500">انتخاب‌های تازه و محبوب را با جستجو، فیلتر و مرتب‌سازی سریع پیدا کنید.</p>
          </div>
          <form className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl" method="get">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
              <input name="search" defaultValue={params.search || ''} placeholder="نام محصول را جستجو کنید..." className="h-12 w-full rounded-[14px] border border-[var(--border)] bg-[var(--surface-soft)] px-11 text-[12px] font-medium outline-none transition focus:border-[var(--brand)] focus:bg-white" />
            </div>
            <select name="sort" defaultValue={params.sort || 'created_at'} className="h-12 rounded-[14px] border border-[var(--border)] bg-white px-4 text-[12px] font-bold outline-none focus:border-[var(--brand)]">
              <option value="created_at">جدیدترین</option><option value="price">قیمت</option><option value="name">نام</option>
            </select>
            <input type="hidden" name="direction" value={params.sort === 'price' ? (params.direction === 'desc' ? 'desc' : 'asc') : 'desc'} />
            <button className="h-12 rounded-[14px] bg-slate-950 px-6 text-[12px] font-black text-white transition hover:bg-[var(--brand)]">جستجو</button>
          </form>
        </div>

        <div className="mt-7 flex flex-wrap gap-2 border-t border-[var(--border)] pt-5">
          <FilterChip href={buildHref(params, { inStock: '1', page: '' })} active={['1', 'true', 'yes'].includes(String(params.inStock || '').toLowerCase())}>فقط موجودها</FilterChip>
          <FilterChip href={buildHref(params, { sort: 'price', direction: 'asc', page: '' })} active={params.sort === 'price' && params.direction !== 'desc'}>ارزان‌ترین</FilterChip>
          <FilterChip href={buildHref(params, { sort: 'price', direction: 'desc', page: '' })} active={params.sort === 'price' && params.direction === 'desc'}>گران‌ترین</FilterChip>
          <FilterChip href={buildHref(params, { sort: 'created_at', direction: 'desc', page: '' })} active={!params.sort || params.sort === 'created_at'}>جدیدترین</FilterChip>
          {(params.search || params.inStock || params.minPrice || params.maxPrice || params.category || params.brand) && <Link href="/products" className="rounded-full px-3.5 py-2 text-[11px] font-bold text-slate-400 transition hover:text-red-600">پاک کردن فیلترها</Link>}
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-[250px]">
          <div className="sticky top-24 rounded-[22px] border border-[var(--border)] bg-white p-5 shadow-[0_12px_35px_rgba(23,23,23,.035)]">
            <div className="flex items-center justify-between"><h2 className="text-[12px] font-black">فیلترهای دقیق</h2><span className="text-[10px] font-bold text-slate-400">فروشگاه</span></div>
            <form method="get" className="mt-5 space-y-5">
              {params.search ? <input type="hidden" name="search" value={params.search} /> : null}
              {params.category ? <input type="hidden" name="category" value={params.category} /> : null}
              {params.brand ? <input type="hidden" name="brand" value={params.brand} /> : null}
              <input type="hidden" name="sort" value={params.sort || 'created_at'} /><input type="hidden" name="direction" value={params.direction || 'desc'} />
              <div className="border-t border-[var(--border)] pt-4"><p className="text-[11px] font-black text-slate-500">بازه قیمت (تومان)</p><div className="mt-3 grid grid-cols-2 gap-2"><input name="minPrice" inputMode="numeric" placeholder="از" defaultValue={params.minPrice || ''} className="h-10 rounded-[10px] border border-[var(--border)] px-3 text-[11px] outline-none focus:border-[var(--brand)]" /><input name="maxPrice" inputMode="numeric" placeholder="تا" defaultValue={params.maxPrice || ''} className="h-10 rounded-[10px] border border-[var(--border)] px-3 text-[11px] outline-none focus:border-[var(--brand)]" /></div></div>
              <label className="flex cursor-pointer items-center gap-3 border-t border-[var(--border)] pt-4 text-[11px] font-bold"><input type="checkbox" name="inStock" value="1" defaultChecked={['1', 'true', 'yes'].includes(String(params.inStock || '').toLowerCase())} className="h-4 w-4 accent-[var(--brand)]" />فقط کالاهای موجود</label>
              <button type="submit" className="h-11 w-full rounded-[12px] bg-slate-950 text-[11px] font-black text-white transition hover:bg-[var(--brand)]">اعمال فیلترها</button>
            </form>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          {result.failed ? <div className="rounded-[24px] border border-red-100 bg-red-50 p-10 text-center"><h2 className="font-black text-red-900">دریافت محصولات ممکن نشد</h2><p className="mt-2 text-[11px] text-red-700">لطفاً کمی بعد دوباره تلاش کنید.</p></div> : products.length === 0 ? <div className="rounded-[24px] border border-[var(--border)] bg-white px-6 py-20 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-slate-50 text-2xl text-slate-300">⌕</div><h2 className="mt-5 font-black">محصولی پیدا نشد</h2><p className="mt-2 text-[11px] text-slate-500">عبارت جستجو یا فیلترهای خود را تغییر دهید.</p><Link href="/products" className="mt-5 inline-flex rounded-[12px] bg-slate-950 px-5 py-3 text-[11px] font-black text-white">نمایش همه محصولات</Link></div> : <>
            <div className="mb-4 flex items-center justify-between"><p className="text-[11px] font-bold text-slate-400"><span className="font-black text-slate-700">{result.pagination?.total || 0}</span> محصول</p><p className="text-[10px] font-bold text-slate-400">صفحه {page}</p></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            <div className="mt-8 flex items-center justify-between"><div>{page > 1 ? <Link href={buildHref(params, { page: String(page - 1) })} className="rounded-[12px] border border-[var(--border)] bg-white px-4 py-2.5 text-[11px] font-bold hover:border-slate-300">صفحه قبل</Link> : null}</div><span className="text-[10px] font-bold text-slate-400">{page}</span><div>{hasMore ? <Link href={buildHref(params, { page: String(page + 1) })} className="rounded-[12px] bg-slate-950 px-4 py-2.5 text-[11px] font-bold text-white hover:bg-[var(--brand)]">صفحه بعد</Link> : null}</div></div>
          </>}
        </section>
      </div>
    </div>
  );
}
