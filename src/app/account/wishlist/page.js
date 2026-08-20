import Link from 'next/link';
import Image from 'next/image';
import { requireUser } from '../../../lib/auth/session.js';
import { query } from '../../../server/db/connection.js';

export const metadata = { title: 'علاقه‌مندی‌ها' };

const money = (value) => new Intl.NumberFormat('fa-IR').format(Number(value || 0));

export default async function WishlistPage() {
  const user = await requireUser();
  const items = await query(
    `SELECT f.product_id,p.name,p.slug,p.thumbnail_url,COALESCE(v.price,p.base_price) price
     FROM favorites f
     INNER JOIN products p ON p.id=f.product_id AND p.deleted_at IS NULL
     LEFT JOIN product_variants v ON v.id=p.default_variant_id
     WHERE f.user_id=? ORDER BY f.created_at DESC`,
    [user.id],
  );

  return (
    <main dir="rtl" className="store-shell py-7 sm:py-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/account" className="text-[10px] font-black text-slate-400 transition hover:text-[var(--brand)]">← حساب کاربری</Link>
          <p className="mt-5 text-[10px] font-black text-[var(--brand)]">لیست انتخاب‌های شما</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">علاقه‌مندی‌ها</h1>
          <p className="mt-2 text-[11px] text-slate-400">محصولاتی که برای خرید بعدی نگه داشته‌اید.</p>
        </div>
        {items.length > 0 && <span className="w-fit border border-[var(--border)] bg-white px-4 py-2 text-[9px] font-black text-slate-500">{items.length.toLocaleString('fa-IR')} محصول ذخیره‌شده</span>}
      </div>

      {items.length ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {items.map((p) => (
            <Link key={p.product_id} href={`/products/${p.slug}`} className="group flex min-w-0 flex-col border border-[var(--border)] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(23,23,23,.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2">
              <div className="relative aspect-[.92] overflow-hidden bg-[#fafaf8]">
                {p.thumbnail_url ? <Image src={p.thumbnail_url} alt={p.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-contain p-4 transition duration-500 group-hover:scale-[1.045]"/> : <div className="flex h-full items-center justify-center text-[9px] font-bold text-slate-300">تصویر موجود نیست</div>}
                <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center bg-white/95 text-sm text-[var(--brand)] shadow-sm" aria-hidden="true">♥</span>
              </div>
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h2 className="line-clamp-2 text-[11px] font-black leading-6 text-slate-800 sm:text-xs">{p.name}</h2>
                <div className="mt-auto pt-5"><p className="text-[8px] font-bold text-slate-400">قیمت فعلی</p><p className="mt-1 text-[12px] font-black sm:text-[13px]">{money(p.price)} <span className="text-[8px] font-bold text-slate-400">تومان</span></p><span className="mt-3 inline-flex text-[9px] font-black text-[var(--brand)] opacity-70 transition group-hover:opacity-100">مشاهده محصول ←</span></div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-dashed border-[var(--border)] bg-white px-6 py-20 text-center shadow-[0_12px_35px_rgba(23,23,23,.025)]">
          <div className="mx-auto grid h-14 w-14 place-items-center bg-[#fff4f4] text-xl text-[var(--brand)]">♥</div>
          <h2 className="mt-5 text-xl font-black">هنوز محصولی ذخیره نکرده‌اید</h2>
          <p className="mx-auto mt-2 max-w-sm text-[10px] leading-6 text-slate-400">محصولات موردعلاقه‌تان را هنگام مرور فروشگاه ذخیره کنید تا بعداً سریع‌تر به آن‌ها برگردید.</p>
          <Link href="/products" className="mt-6 inline-flex bg-[var(--brand)] px-6 py-3 text-[10px] font-black text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2">مشاهده محصولات</Link>
        </div>
      )}
    </main>
  );
}
