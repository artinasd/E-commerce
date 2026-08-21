import Link from 'next/link';
import ProductCard from '../../components/storefront/ProductCard';
import { getBrands, getCategories } from '../../server/catalog/service.js';

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
  return <Link href={href} className={`inline-flex items-center rounded-full border px-3.5 py-2 text-[10px] font-extrabold transition ${active ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]' : 'border-[var(--border)] bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900'}`}>{children}</Link>;
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const [result, categories, brands] = await Promise.all([
    getProducts(params),
    getCategories({ all: true }),
    getBrands({ limit: 100 }),
  ]);
  const products = result.products || [];
  const page = Number(params.page || 1);
  const hasMore = Boolean(result.pagination?.hasMore);
  const activeFilterCount = [params.search, params.category, params.brand, params.minPrice, params.maxPrice, params.inStock].filter(Boolean).length;
  const selectedCategory = categories.find((item) => item.slug === params.category);
  const selectedBrand = brands.find((item) => item.slug === params.brand);

  return (
    <div className="store-shell py-6 sm:py-9">
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
        <Link href="/" className="transition hover:text-[var(--brand)]">خانه</Link><span>←</span><span className="font-black text-slate-700">محصولات</span>
      </div>

      <header className="mt-5 flex flex-col gap-5 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-[9px] font-black uppercase tracking-[.18em] text-[var(--brand)]">فروشگاه آنلاین</p><h1 className="mt-1.5 text-2xl font-black tracking-tight sm:text-3xl">همه محصولات</h1><p className="mt-2 max-w-2xl text-[11px] leading-7 text-slate-500">محصول موردنظرتان را سریع پیدا کنید؛ با فیلتر قیمت، برند، دسته‌بندی و وضعیت موجودی.</p></div>
        <form className="flex w-full max-w-2xl gap-2" method="get">
          <div className="relative min-w-0 flex-1"><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg leading-none text-slate-400">⌕</span><input name="search" defaultValue={params.search || ''} placeholder="جستجو در محصولات..." className="h-11 w-full rounded-[12px] border border-[var(--border)] bg-white px-11 text-[11px] font-medium outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-rose-50" /></div>
          <select name="sort" defaultValue={params.sort || 'created_at'} className="hidden h-11 rounded-[12px] border border-[var(--border)] bg-white px-3 text-[10px] font-extrabold outline-none focus:border-[var(--brand)] sm:block"><option value="created_at">جدیدترین</option><option value="price">قیمت</option><option value="name">نام</option></select>
          <input type="hidden" name="direction" value={params.sort === 'price' ? (params.direction === 'desc' ? 'desc' : 'asc') : 'desc'} />
          <button className="h-11 rounded-[12px] bg-slate-950 px-5 text-[10px] font-black text-white transition hover:bg-[var(--brand)]">جستجو</button>
        </form>
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <FilterChip href={buildHref(params, { inStock: '1', page: '' })} active={['1', 'true', 'yes'].includes(String(params.inStock || '').toLowerCase())}>فقط موجودها</FilterChip>
        <FilterChip href={buildHref(params, { sort: 'price', direction: 'asc', page: '' })} active={params.sort === 'price' && params.direction !== 'desc'}>ارزان‌ترین</FilterChip>
        <FilterChip href={buildHref(params, { sort: 'price', direction: 'desc', page: '' })} active={params.sort === 'price' && params.direction === 'desc'}>گران‌ترین</FilterChip>
        <FilterChip href={buildHref(params, { sort: 'created_at', direction: 'desc', page: '' })} active={!params.sort || params.sort === 'created_at'}>جدیدترین</FilterChip>
        {selectedCategory && <FilterChip href={buildHref(params, { category: '' })} active>{selectedCategory.name} ×</FilterChip>}
        {selectedBrand && <FilterChip href={buildHref(params, { brand: '' })} active>{selectedBrand.name} ×</FilterChip>}
        {activeFilterCount > 0 && <Link href="/products" className="px-2 text-[10px] font-bold text-slate-400 transition hover:text-red-600">پاک کردن همه</Link>}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <input id="mobile-filter-toggle" type="checkbox" className="peer sr-only" aria-label="نمایش فیلترهای محصولات" />
        <label htmlFor="mobile-filter-toggle" className="fixed inset-0 z-[60] hidden bg-slate-950/30 backdrop-blur-[2px] peer-checked:block lg:hidden" aria-label="بستن فیلترها" />
        <aside className="order-2 translate-x-full border border-[var(--border)] bg-white transition-transform duration-300 peer-checked:translate-x-0 lg:order-1 lg:translate-x-0 lg:sticky lg:top-24 lg:block lg:h-fit lg:p-5 lg:shadow-none lg:transition-none max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:z-[70] max-lg:w-[min(88vw,390px)] max-lg:overflow-y-auto max-lg:p-5 max-lg:shadow-[-20px_0_60px_rgba(0,0,0,.12)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4"><div><p className="text-[9px] font-black text-[var(--brand)] lg:hidden">فیلتر محصولات</p><h2 className="mt-1 text-[11px] font-black lg:mt-0">فیلترها</h2></div>{activeFilterCount > 0 && <span className="text-[9px] font-black text-[var(--brand)]">{activeFilterCount} فعال</span>}<label htmlFor="mobile-filter-toggle" className="grid h-9 w-9 cursor-pointer place-items-center border border-[var(--border)] text-lg text-slate-500 lg:hidden" aria-label="بستن">×</label></div>
          <form method="get" className="space-y-5 pt-4">
            {params.search ? <input type="hidden" name="search" value={params.search} /> : null}<input type="hidden" name="sort" value={params.sort || 'created_at'} /><input type="hidden" name="direction" value={params.direction || 'desc'} />
            <label className="grid gap-2 text-[10px] font-black text-slate-500">دسته‌بندی<select name="category" defaultValue={params.category || ''} className="h-11 lg:h-10 rounded-[10px] border border-[var(--border)] bg-white px-3 text-[10px] font-bold text-slate-700 outline-none focus:border-[var(--brand)]"><option value="">همه دسته‌بندی‌ها</option>{categories.map((category) => <option key={category.id} value={category.slug}>{category.parent_id ? `↳ ${category.name}` : category.name}</option>)}</select></label>
            <label className="grid gap-2 text-[10px] font-black text-slate-500">برند<select name="brand" defaultValue={params.brand || ''} className="h-11 lg:h-10 rounded-[10px] border border-[var(--border)] bg-white px-3 text-[10px] font-bold text-slate-700 outline-none focus:border-[var(--brand)]"><option value="">همه برندها</option>{brands.map((brand) => <option key={brand.id} value={brand.slug}>{brand.name}</option>)}</select></label>
            <div><p className="text-[10px] font-black text-slate-500">بازه قیمت (تومان)</p><div className="mt-2 grid grid-cols-2 gap-2"><input name="minPrice" inputMode="numeric" placeholder="از" defaultValue={params.minPrice || ''} className="h-11 lg:h-10 rounded-[10px] border border-[var(--border)] px-2.5 text-[10px] outline-none focus:border-[var(--brand)]" /><input name="maxPrice" inputMode="numeric" placeholder="تا" defaultValue={params.maxPrice || ''} className="h-11 lg:h-10 rounded-[10px] border border-[var(--border)] px-2.5 text-[10px] outline-none focus:border-[var(--brand)]" /></div></div>
            <label className="flex cursor-pointer items-center gap-2.5 border-t border-[var(--border)] pt-4 text-[10px] font-bold text-slate-600"><input type="checkbox" name="inStock" value="1" defaultChecked={['1', 'true', 'yes'].includes(String(params.inStock || '').toLowerCase())} className="h-4 w-4 accent-[var(--brand)]" />فقط کالاهای موجود</label>
            <button type="submit" className="h-11 w-full bg-slate-950 text-[10px] font-black text-white transition hover:bg-[var(--brand)] lg:h-10">اعمال فیلتر</button>
          </form>
        </aside>

        <section className="order-1 min-w-0 lg:order-2">
          <div className="mb-4 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><p className="text-[10px] font-bold text-slate-400"><span className="font-black text-slate-700">{result.pagination?.total || 0}</span> محصول</p><label htmlFor="mobile-filter-toggle" className="inline-flex h-10 cursor-pointer items-center gap-2 border border-[var(--border)] bg-white px-3.5 text-[10px] font-black text-slate-800 shadow-sm transition hover:border-slate-300 lg:hidden"><svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>فیلترها{activeFilterCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--brand)] px-1 text-[8px] text-white">{activeFilterCount.toLocaleString('fa-IR')}</span>}</label></div><p className="text-[9px] font-bold text-slate-400">صفحه {page}</p></div>
          {result.failed ? <div className="border border-red-100 bg-red-50 p-10 text-center"><h2 className="text-[12px] font-black text-red-900">دریافت محصولات ممکن نشد</h2><p className="mt-2 text-[10px] text-red-700">لطفاً کمی بعد دوباره تلاش کنید.</p></div> : products.length === 0 ? <div className="border border-[var(--border)] bg-white px-6 py-20 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-50 text-xl text-slate-300">⌕</div><h2 className="mt-5 text-[12px] font-black">محصولی پیدا نشد</h2><p className="mt-2 text-[10px] text-slate-500">عبارت جستجو یا فیلترهای خود را تغییر دهید.</p><Link href="/products" className="mt-5 inline-flex bg-slate-950 px-5 py-3 text-[10px] font-black text-white transition hover:bg-[var(--brand)]">نمایش همه محصولات</Link></div> : <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
            <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-5"><div>{page > 1 ? <Link href={buildHref(params, { page: String(page - 1) })} className="inline-flex rounded-[10px] border border-[var(--border)] bg-white px-4 py-2.5 text-[10px] font-bold hover:border-slate-300">صفحه قبل</Link> : <span />}</div><span className="text-[10px] font-black text-slate-500">{page.toLocaleString('fa-IR')}</span><div>{hasMore ? <Link href={buildHref(params, { page: String(page + 1) })} className="inline-flex rounded-[10px] bg-slate-950 px-4 py-2.5 text-[10px] font-bold text-white hover:bg-[var(--brand)]">صفحه بعد</Link> : <span />}</div></div>
          </>}
        </section>
      </div>
    </div>
  );
}
