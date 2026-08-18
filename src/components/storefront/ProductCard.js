/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import FavoriteButton from './FavoriteButton.js';

function formatPrice(value) { return new Intl.NumberFormat('fa-IR').format(Number(value || 0)); }

export default function ProductCard({ product }) {
  const image = product.primary_image_url || product.image_url;
  const price = Number(product.price || product.min_price || 0);
  const compareAtPrice = Number(product.compare_at_price || 0);
  const discountPercent = compareAtPrice > price && price > 0 ? Math.round((1 - price / compareAtPrice) * 100) : 0;

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-[20px] border border-[var(--border)] bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_22px_55px_rgba(23,23,23,.10)]">
      <div className="absolute left-3 top-3 z-10"><FavoriteButton productId={product.id} /></div>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-[#f5f5f2]">
          {image ? (
            <img src={image} alt={product.name} loading="lazy" className="h-full w-full object-contain p-7 transition duration-500 ease-out group-hover:scale-[1.06]" />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-xs font-medium text-slate-400">تصویری برای این محصول ثبت نشده</div>
          )}
          {discountPercent > 0 && <span className="absolute right-3 top-3 rounded-full bg-[var(--brand)] px-2.5 py-1 text-[10px] font-black text-white shadow-sm">{discountPercent.toLocaleString('fa-IR')}٪</span>}
        </div>
        <div className="p-4 sm:p-5">
          {product.brand_name && <p className="mb-2 text-[11px] font-bold text-slate-400">{product.brand_name}</p>}
          <h3 className="line-clamp-2 min-h-12 text-[13px] font-extrabold leading-6 text-[#252525]">{product.name}</h3>
          <div className="mt-5 flex items-end justify-between gap-3">
            <div className="min-w-0">
              {compareAtPrice > price && <p className="text-[11px] font-medium text-slate-400 line-through">{formatPrice(compareAtPrice)} تومان</p>}
              <p className="mt-1 text-[16px] font-black text-[#171717]">{formatPrice(price)} <span className="text-[10px] font-bold text-slate-400">تومان</span></p>
            </div>
            {(product.average_rating ?? product.rating) != null && <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-black text-amber-600">★ {Number(product.average_rating ?? product.rating).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}</span>}
          </div>
        </div>
      </Link>
    </article>
  );
}
