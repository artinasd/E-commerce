import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '../../../components/storefront/ProductCard';
import { getBrandBySlug, getProducts } from '../../../server/catalog/service.js';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  return { title: brand ? `${brand.name} | فروشگاه` : 'برند' };
}

export default async function BrandPage({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const page = Math.max(Number(query?.page) || 1, 1);
  const result = await getProducts({
    brandSlug: slug,
    page,
    limit: 24,
    sort: query?.sort || 'created_at',
    direction: query?.direction || 'desc',
    inStock: ['1', 'true', 'yes'].includes(String(query?.inStock || '').toLowerCase()),
    minPrice: query?.minPrice,
    maxPrice: query?.maxPrice,
    search: query?.search,
  });

  const products = result.products || [];
  const paramsForPage = new URLSearchParams();
  if (query?.sort) paramsForPage.set('sort', query.sort);
  if (query?.direction) paramsForPage.set('direction', query.direction);
  if (query?.inStock) paramsForPage.set('inStock', query.inStock);
  if (query?.minPrice) paramsForPage.set('minPrice', query.minPrice);
  if (query?.maxPrice) paramsForPage.set('maxPrice', query.maxPrice);
  if (query?.search) paramsForPage.set('search', query.search);
  const hrefForPage = (nextPage) => `/brands/${encodeURIComponent(slug)}?${new URLSearchParams([...paramsForPage, ['page', String(nextPage)]]).toString()}`;

  return (
    <main dir="rtl" className="store-shell py-7 sm:py-10">
      <nav className="flex items-center gap-2 text-xs font-bold text-slate-400">
        <Link href="/" className="hover:text-[var(--brand)]">خانه</Link><span>←</span>
        <Link href="/products" className="hover:text-[var(--brand)]">محصولات</Link><span>←</span>
        <span className="font-black text-slate-700">{brand.name}</span>
      </nav>

      <header className="mt-6 overflow-hidden border border-[var(--border)] bg-white">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          {brand.logo_url ? <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden bg-slate-50 p-3 sm:h-28 sm:w-28"><img src={brand.logo_url} alt={brand.name} className="h-full w-full object-contain" /></div> : null}
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--brand)]">برند</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{brand.name}</h1>
            <p className="mt-2 text-sm leading-7 text-slate-500">محصولات برند {brand.name} را بررسی کنید و انتخاب خود را انجام دهید.</p>
          </div>
        </div>
      </header>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <p className="text-sm font-bold text-slate-400"><span className="font-black text-slate-800">{result.pagination?.total || 0}</span> محصول</p>
        <div className="flex gap-2">
          <Link href={`/brands/${encodeURIComponent(slug)}`} className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-black hover:border-slate-300">جدیدترین</Link>
          <Link href={`/brands/${encodeURIComponent(slug)}?sort=price&direction=asc`} className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-black hover:border-slate-300">ارزان‌ترین</Link>
          <Link href={`/brands/${encodeURIComponent(slug)}?sort=price&direction=desc`} className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-xs font-black hover:border-slate-300">گران‌ترین</Link>
        </div>
      </div>

      {products.length ? <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="mt-6 border border-[var(--border)] bg-white px-6 py-20 text-center"><h2 className="text-xl font-black">محصولی برای این برند پیدا نشد</h2><p className="mt-2 text-sm text-slate-500">فعلاً محصول فعالی برای نمایش وجود ندارد.</p><Link href="/products" className="mt-6 inline-flex bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-[var(--brand)]">مشاهده همه محصولات</Link></div>}

      {(page > 1 || result.pagination?.hasMore) && <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-5"><div>{page > 1 ? <Link href={hrefForPage(page - 1)} className="rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-black">صفحه قبل</Link> : <span />}</div><span className="text-sm font-black text-slate-500">{page.toLocaleString('fa-IR')}</span><div>{result.pagination?.hasMore ? <Link href={hrefForPage(page + 1)} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-[var(--brand)]">صفحه بعد</Link> : <span />}</div></div>}
    </main>
  );
}
