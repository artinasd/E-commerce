import Link from 'next/link';
import AddToCart from '../../../components/storefront/AddToCart';

async function getProduct(slug) {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try {
    const response = await fetch(`${base}/api/products/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
    if (!response.ok) return null;
    return (await response.json()).data?.product ?? null;
  } catch {
    return null;
  }
}

function formatPrice(value) { return new Intl.NumberFormat('fa-IR').format(Number(value || 0)); }

export async function generateMetadata({ params }) {
  const product = await getProduct((await params).slug);
  return product ? { title: product.name, description: product.short_description || product.description || undefined } : { title: 'محصول پیدا نشد' };
}

export default async function ProductPage({ params }) {
  const product = await getProduct((await params).slug);
  if (!product) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-2xl font-black">محصول پیدا نشد</h1><p className="mt-2 text-sm text-slate-500">این محصول وجود ندارد یا دیگر در دسترس نیست.</p><Link href="/products" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">بازگشت به محصولات</Link></div>;
  }

  const images = product.images || [];
  const primary = images[0]?.url;
  const variants = product.variants || [];
  const cheapest = variants.filter((variant) => Number(variant.available_quantity) > 0).sort((a, b) => Number(a.price) - Number(b.price))[0] || variants[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
      <nav className="mb-6 text-xs text-slate-400" aria-label="مسیر صفحه">
        <Link href="/products" className="hover:text-[var(--brand)]">محصولات</Link><span className="mx-2">/</span>{product.category_name && <><span>{product.category_name}</span><span className="mx-2">/</span></>}{product.name}
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-white">
          <div className="aspect-square bg-slate-50">
            {primary ? <img src={primary} alt={images[0]?.alt_text || product.name} className="h-full w-full object-contain p-8 sm:p-14" /> : <div className="flex h-full items-center justify-center text-sm text-slate-400">بدون تصویر</div>}
          </div>
          {images.length > 1 && <div className="grid grid-cols-5 gap-2 border-t border-[var(--border)] p-3">{images.slice(0, 5).map((image) => <div key={image.id} className="aspect-square overflow-hidden rounded-xl bg-slate-50"><img src={image.url} alt={image.alt_text || product.name} className="h-full w-full object-contain" /></div>)}</div>}
        </section>

        <section className="self-start lg:sticky lg:top-24">
          <div className="border-b border-[var(--border)] pb-6">
            <p className="text-xs font-semibold text-slate-400">{product.brand_name || 'برند'}</p>
            <h1 className="mt-2 text-2xl font-black leading-9 text-slate-950 sm:text-3xl">{product.name}</h1>
            {product.short_description && <p className="mt-3 text-sm leading-7 text-slate-500">{product.short_description}</p>}
          </div>

          <div className="py-6">
            <div className="flex items-end justify-between gap-4">
              <div><p className="text-xs text-slate-400">قیمت از</p><p className="mt-1 text-2xl font-black">{formatPrice(cheapest?.price)} <span className="text-xs font-medium text-slate-400">تومان</span></p></div>
              {product.status === 'ACTIVE' && <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">موجود</span>}
            </div>
            <div className="mt-6"><AddToCart variants={variants} /></div>
          </div>

          {(product.description || product.category_name || product.brand_name) && <div className="border-t border-[var(--border)] pt-6"><h2 className="text-base font-black">درباره محصول</h2>{product.description && <p className="mt-3 whitespace-pre-line text-sm leading-8 text-slate-600">{product.description}</p>}<dl className="mt-5 grid grid-cols-2 gap-3 text-xs"><div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-400">دسته‌بندی</dt><dd className="mt-1 font-bold">{product.category_name || '—'}</dd></div><div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-400">برند</dt><dd className="mt-1 font-bold">{product.brand_name || '—'}</dd></div></dl></div>}
        </section>
      </div>
    </div>
  );
}
