import Link from 'next/link';
import FavoriteButton from './FavoriteButton.js';

function formatPrice(value) { return new Intl.NumberFormat('fa-IR').format(Number(value || 0)); }

export default function ProductCard({ product }) {
  const image = product.primary_image_url || product.image_url;
  const price = Number(product.price || product.min_price || 0);
  const compareAtPrice = Number(product.compare_at_price || 0);
  const discountPercent = compareAtPrice > price && price > 0 ? Math.round((1 - price / compareAtPrice) * 100) : 0;

  return <article className="group relative min-w-0 border border-[var(--border)] bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(23,23,23,.09)]">
    <div className="absolute left-3 top-3 z-10"><FavoriteButton productId={product.id}/></div>
    <Link href={`/products/${product.slug}`} className="block">
      <div className="relative aspect-[0.92] overflow-hidden bg-[#f6f5f1]">
        {image ? <img src={image} alt={product.name} loading="lazy" className="h-full w-full object-contain p-5 transition duration-500 group-hover:scale-[1.045]" /> : <div className="flex h-full items-center justify-center text-xs font-medium text-slate-400">تصویری برای این محصول ثبت نشده</div>}
        {discountPercent > 0 && <span className="absolute right-3 top-3 bg-[var(--brand)] px-2 py-1 text-[10px] font-black text-white">{discountPercent.toLocaleString('fa-IR')}٪ تخفیف</span>}
      </div>
      <div className="p-4 sm:p-5">
        {product.brand_name && <p className="mb-2 text-[11px] font-semibold text-slate-400">{product.brand_name}</p>}
        <h3 className="line-clamp-2 min-h-12 text-[13px] font-bold leading-6 text-[#252525]">{product.name}</h3>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div className="min-w-0">{compareAtPrice > price && <p className="text-[11px] text-slate-400 line-through">{formatPrice(compareAtPrice)}</p>}<p className="mt-0.5 text-[15px] font-black text-[#171717]">{formatPrice(price)} <span className="text-[10px] font-medium text-slate-400">تومان</span></p></div>
          {(product.average_rating ?? product.rating) != null && <span className="shrink-0 text-[11px] font-bold text-amber-500">★ {Number(product.average_rating ?? product.rating).toLocaleString('fa-IR', { maximumFractionDigits: 1 })}</span>}
        </div>
      </div>
    </Link>
  </article>;
}
