import Link from 'next/link';
import AddToCart from '../../../components/storefront/AddToCart';
import FavoriteButton from '../../../components/storefront/FavoriteButton';
import ProductGallery from '../../../components/storefront/ProductGallery';
import ProductReviewForm from '../../../components/storefront/ProductReviewForm';

async function getProduct(slug) {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try { const response = await fetch(`${base}/api/products/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } }); if (!response.ok) return null; return (await response.json()).data?.product ?? null; } catch { return null; }
}
async function getReviews(slug) {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  try { const response = await fetch(`${base}/api/products/${encodeURIComponent(slug)}/reviews?limit=12`, { next: { revalidate: 60 } }); if (!response.ok) return { averageRating: 0, reviewCount: 0, reviews: [] }; return (await response.json()).data ?? { averageRating: 0, reviewCount: 0, reviews: [] }; } catch { return { averageRating: 0, reviewCount: 0, reviews: [] }; }
}
const money = (value) => new Intl.NumberFormat('fa-IR').format(Number(value || 0));
const ratingText = (value) => Number(value || 0).toLocaleString('fa-IR', { maximumFractionDigits: 1 });
function Stars({ value }) { const rounded = Math.round(Number(value || 0)); return <span aria-label={`${ratingText(value)} از ۵`} className="tracking-wide text-amber-500">{'★'.repeat(rounded)}<span className="text-slate-200">{'★'.repeat(Math.max(5 - rounded, 0))}</span></span>; }
export async function generateMetadata({ params }) { const product = await getProduct((await params).slug); return product ? { title: product.name, description: product.short_description || product.description || undefined } : { title: 'محصول پیدا نشد' }; }

export default async function ProductPage({ params }) {
  const slug = (await params).slug;
  const [product, reviewData] = await Promise.all([getProduct(slug), getReviews(slug)]);
  if (!product) return <div className="store-shell py-24"><div className="mx-auto max-w-lg rounded-[28px] border border-[var(--border)] bg-white px-6 py-14 text-center shadow-[0_18px_55px_rgba(23,23,23,.06)]"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--brand-soft)] text-2xl">⌕</div><h1 className="mt-5 text-2xl font-black">محصول پیدا نشد</h1><p className="mt-2 text-sm leading-7 text-slate-500">این محصول وجود ندارد یا دیگر در دسترس نیست.</p><Link href="/products" className="mt-6 inline-flex rounded-[12px] bg-slate-950 px-6 py-3 text-[11px] font-black text-white hover:bg-[var(--brand)]">بازگشت به محصولات</Link></div></div>;
  const images = product.images || [];
  const variants = product.variants || [];
  const cheapest = variants.filter((v) => Number(v.available_quantity) > 0).sort((a, b) => Number(a.price) - Number(b.price))[0] || variants[0];
  const averageRating = Number(reviewData.averageRating || product.average_rating || 0);
  const reviewCount = Number(reviewData.reviewCount || product.review_count || 0);
  const hasDiscount = cheapest && Number(cheapest.compare_at_price || 0) > Number(cheapest.price || 0);
  const discountPercent = hasDiscount ? Math.round((1 - Number(cheapest.price) / Number(cheapest.compare_at_price)) * 100) : 0;

  return <div className="store-shell py-6 sm:py-9">
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-400" aria-label="مسیر صفحه"><Link href="/products" className="hover:text-[var(--brand)]">محصولات</Link><span>/</span>{product.category_name && <><span>{product.category_name}</span><span>/</span></>}<span className="truncate text-slate-600">{product.name}</span></nav>
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
      <section className="self-start overflow-hidden rounded-[28px] border border-[var(--border)] bg-white shadow-[0_18px_55px_rgba(23,23,23,.045)]"><ProductGallery productName={product.name} images={images}/></section>
      <section className="self-start lg:sticky lg:top-24">
        <div className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_55px_rgba(23,23,23,.045)] sm:p-7">
          <div className="flex items-start justify-between gap-5"><div className="min-w-0"><p className="text-[10px] font-black tracking-wide text-[var(--brand)]">{product.brand_name || 'فروشگاه ایرانیان'}</p><h1 className="mt-2 text-2xl font-black leading-[1.8] tracking-tight text-slate-950 sm:text-[30px]">{product.name}</h1></div><FavoriteButton productId={product.id} className="shrink-0"/></div>
          {product.short_description && <p className="mt-4 text-[14px] leading-8 text-slate-500">{product.short_description}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px]"><span className="font-black text-amber-500"><Stars value={averageRating}/></span><span className="font-black text-slate-800">{ratingText(averageRating)}</span><a href="#reviews" className="text-slate-400 hover:text-[var(--brand)]">{reviewCount.toLocaleString('fa-IR')} دیدگاه</a><span className="h-1 w-1 rounded-full bg-slate-300"/><span className="text-emerald-600">خرید مطمئن</span></div>
          <div className="my-7 border-t border-[var(--border)]"/>
          <div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold text-slate-400">قیمت</p><p className="mt-1 text-[26px] font-black tracking-tight">{money(cheapest?.price)} <span className="text-[10px] font-bold text-slate-400">تومان</span></p>{hasDiscount && <p className="mt-1 text-[11px] text-slate-400 line-through">{money(cheapest.compare_at_price)} تومان</p>}</div>{Number(cheapest?.available_quantity) > 0 ? <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700">موجود در انبار</span> : <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black text-slate-500">ناموجود</span>}</div>
          {hasDiscount && <div className="mt-4 inline-flex rounded-full bg-red-50 px-3 py-1 text-[10px] font-black text-[var(--brand)]">{discountPercent.toLocaleString('fa-IR')}٪ تخفیف</div>}
          <div className="mt-6"><AddToCart variants={variants}/></div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[9px] font-bold text-slate-500"><div className="rounded-[14px] bg-slate-50 p-3">ارسال مطمئن</div><div className="rounded-[14px] bg-slate-50 p-3">تضمین کیفیت</div><div className="rounded-[14px] bg-slate-50 p-3">پشتیبانی خرید</div></div>
        </div>
        {(product.description || product.category_name || product.brand_name) && <div className="mt-5 rounded-[28px] border border-[var(--border)] bg-white p-6 sm:p-7"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[var(--brand)]"/><h2 className="text-base font-black">معرفی محصول</h2></div>{product.description && <p className="mt-4 whitespace-pre-line text-[15px] leading-9 text-slate-600">{product.description}</p>}<dl className="mt-6 grid grid-cols-2 gap-3 text-[11px]"><div className="rounded-[14px] bg-[#fafaf8] p-3"><dt className="text-slate-400">دسته‌بندی</dt><dd className="mt-1 font-black text-slate-800">{product.category_name || '—'}</dd></div><div className="rounded-[14px] bg-[#fafaf8] p-3"><dt className="text-slate-400">برند</dt><dd className="mt-1 font-black text-slate-800">{product.brand_name || '—'}</dd></div></dl></div>}
      </section>
    </div>
    <section id="reviews" className="mt-10 rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_55px_rgba(23,23,23,.035)] sm:mt-12 sm:p-8"><div className="flex flex-col gap-5 border-b border-[var(--border)] pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-black text-[var(--brand)]">تجربه خریداران</p><h2 className="mt-1 text-2xl font-black">دیدگاه‌ها و امتیازها</h2><p className="mt-2 text-[11px] text-slate-400">نظر واقعی کاربران به تصمیم خرید بهتر کمک می‌کند.</p></div><div className="rounded-[18px] bg-[#fafaf8] px-5 py-4"><div className="flex items-center gap-3"><span className="text-lg"><Stars value={averageRating}/></span><strong className="text-lg">{ratingText(averageRating)}</strong></div><p className="mt-1 text-[9px] text-slate-400">بر اساس {reviewCount.toLocaleString('fa-IR')} دیدگاه</p></div></div><div className="mt-6"><ProductReviewForm slug={slug}/></div>{reviewData.reviews?.length ? <div className="mt-6 grid gap-4 md:grid-cols-2">{reviewData.reviews.map((review) => <article key={review.id} className="rounded-[20px] border border-[var(--border)] bg-[#fcfcfa] p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-[11px] font-black">{review.authorName}</p><p className="mt-1 text-[9px] font-bold text-emerald-600">خریدار تأییدشده</p></div><Stars value={review.rating}/></div>{review.title && <h3 className="mt-4 text-[12px] font-black">{review.title}</h3>}{review.content && <p className="mt-2 whitespace-pre-line text-[11px] leading-7 text-slate-600">{review.content}</p>}</article>)}</div> : <div className="mt-6 rounded-[20px] border border-dashed border-[var(--border)] px-6 py-12 text-center"><p className="text-[12px] font-black text-slate-700">هنوز دیدگاهی ثبت نشده است.</p><p className="mt-2 text-[10px] text-slate-400">پس از خرید و تحویل سفارش، تجربه خود را ثبت کنید.</p></div>}</section>
  </div>;
}
