import Link from 'next/link';

function formatPrice(value) {
  return new Intl.NumberFormat('fa-IR').format(Number(value || 0));
}

export default function ProductCard({ product }) {
  const image = product.primary_image_url || product.image_url;
  const price = Number(product.price || product.min_price || 0);
  const compareAtPrice = Number(product.compare_at_price || 0);

  return (
    <article className="group min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-square overflow-hidden bg-slate-50">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={product.name} loading="lazy" className="h-full w-full object-contain p-5 transition duration-300 group-hover:scale-[1.03]" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">بدون تصویر</div>
          )}
        </div>
        <div className="p-4">
          {product.brand_name && <p className="mb-1 text-xs font-medium text-slate-400">{product.brand_name}</p>}
          <h3 className="line-clamp-2 min-h-11 text-sm font-semibold leading-6 text-slate-800">{product.name}</h3>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              {compareAtPrice > price && <p className="text-xs text-slate-400 line-through">{formatPrice(compareAtPrice)}</p>}
              <p className="text-base font-black text-slate-950">{formatPrice(price)} <span className="text-[10px] font-medium text-slate-400">تومان</span></p>
            </div>
            {product.rating != null && <span className="text-xs font-semibold text-amber-500">★ {Number(product.rating).toFixed(1)}</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}
