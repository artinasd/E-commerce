/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import FavoriteButton from './FavoriteButton.js';

const formatPrice = (value) => new Intl.NumberFormat('fa-IR').format(Number(value || 0));

export default function ProductCard({ product }) {
  const image = product.primary_image_url || product.image_url;
  const price = Number(product.price || product.min_price || 0);
  const compareAtPrice = Number(product.compare_at_price || 0);
  const discountPercent = compareAtPrice > price && price > 0 ? Math.round((1 - price / compareAtPrice) * 100) : 0;
  const rating = product.average_rating ?? product.rating;
  const reviewCount = Number(product.review_count || 0);
  const inStock = product.in_stock ?? Number(product.available_quantity || 0) > 0;

  return (
    <article className="group relative min-w-0 overflow-hidden border border-[var(--border)] bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_22px_50px_rgba(23,23,23,.09)]">
      <div className="relative">
        <Link href={`/products/${product.slug}`} className="block" aria-label={product.name}>
          <div className="relative aspect-[.92] overflow-hidden bg-[#f5f4f0]">
            {image ? (
              <img src={image} alt={product.name} loading="lazy" className="h-full w-full object-contain p-4 sm:p-6 transition duration-500 ease-out group-hover:scale-[1.055]" />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-[10px] font-bold text-slate-400">تصویری برای این محصول ثبت نشده</div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition group-hover:opacity-100" />
          </div>
        </Link>
        <div className="absolute left-3 top-3 z-10"><FavoriteButton productId={product.id} /></div>
        <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
          {discountPercent > 0 && <span className="bg-[var(--brand)] px-2.5 py-1 text-[9px] font-black text-white">{discountPercent.toLocaleString('fa-IR')}٪</span>}
          {!inStock && <span className="bg-white/90 px-2.5 py-1 text-[9px] font-black text-slate-500 shadow-sm">ناموجود</span>}
        </div>
      </div>
      <div className="border-t border-[var(--border)] p-4 sm:p-5">
        <div className="min-h-[78px]">
          {product.brand_name && <p className="mb-1.5 text-[9px] font-black tracking-wide text-slate-400">{product.brand_name}</p>}
          <Link href={`/products/${product.slug}`} className="line-clamp-2 text-[12px] font-black leading-6 text-[#202020] transition hover:text-[var(--brand)] sm:text-[13px]">{product.name}</Link>
          {(rating != null || reviewCount > 0) && <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold text-slate-400"><span className="text-amber-500">★</span><span className="font-black text-slate-600">{Number(rating || 0).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}</span>{reviewCount > 0 && <span>({reviewCount.toLocaleString('fa-IR')})</span>}</div>}
        </div>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-[var(--border)] pt-4">
          <div className="min-w-0">
            {compareAtPrice > price && <span className="block text-[9px] font-medium text-slate-400 line-through">{formatPrice(compareAtPrice)} تومان</span>}
            <p className="mt-0.5 text-[15px] font-black tracking-tight text-[#151515] sm:text-[16px]">{formatPrice(price)} <span className="text-[8px] font-bold text-slate-400">تومان</span></p>
          </div>
          {discountPercent > 0 && <span className="text-[9px] font-black text-emerald-600">{discountPercent.toLocaleString('fa-IR')}٪ تخفیف</span>}
        </div>
      </div>
    </article>
  );
}
