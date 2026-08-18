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
  return <article className="group relative min-w-0 overflow-hidden border border-[var(--border)] bg-white transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(23,23,23,.08)]">
    <div className="absolute left-2.5 top-2.5 z-10"><FavoriteButton productId={product.id}/></div>
    <Link href={`/products/${product.slug}`} className="block">
      <div className="relative aspect-square overflow-hidden bg-[#f7f7f4]">
        {image ? <img src={image} alt={product.name} loading="lazy" className="h-full w-full object-contain p-5 transition duration-500 ease-out group-hover:scale-[1.045]"/> : <div className="flex h-full items-center justify-center px-6 text-center text-[10px] font-bold text-slate-400">تصویری برای این محصول ثبت نشده</div>}
        {discountPercent > 0 && <span className="absolute right-2.5 top-2.5 rounded-[7px] bg-[var(--brand)] px-2 py-1 text-[9px] font-black text-white">{discountPercent.toLocaleString('fa-IR')}٪</span>}
      </div>
      <div className="p-4">
        {product.brand_name && <p className="mb-1.5 text-[9px] font-extrabold text-slate-400">{product.brand_name}</p>}
        <h3 className="line-clamp-2 min-h-11 text-[11px] font-black leading-5 text-[#202020] sm:text-[12px]">{product.name}</h3>
        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="min-w-0"><div className="flex flex-wrap items-baseline gap-1.5">{compareAtPrice > price && <span className="text-[9px] font-medium text-slate-400 line-through">{formatPrice(compareAtPrice)}</span>}<p className="text-[14px] font-black text-[#151515] sm:text-[15px]">{formatPrice(price)} <span className="text-[8px] font-bold text-slate-400">تومان</span></p></div>{discountPercent > 0 && <p className="mt-1 text-[8px] font-bold text-emerald-600">{discountPercent.toLocaleString('fa-IR')}٪ تخفیف</p>}</div>
          {rating != null && <span className="shrink-0 text-[9px] font-black text-amber-600">★ {Number(rating).toLocaleString('fa-IR',{maximumFractionDigits:1})}</span>}
        </div>
      </div>
    </Link>
  </article>;
}
