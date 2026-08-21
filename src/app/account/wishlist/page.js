import Link from 'next/link';
import Image from 'next/image';
import { requireUser } from '../../../lib/auth/session.js';
import { query } from '../../../server/db/connection.js';

export const metadata = { title: 'علاقه‌مندی‌ها' };
const money = (value) => new Intl.NumberFormat('fa-IR').format(Number(value || 0));

export default async function WishlistPage() {
  const user = await requireUser();
  const items = await query(`SELECT f.product_id,p.name,p.slug,p.thumbnail_url,COALESCE(v.price,p.base_price) price FROM favorites f INNER JOIN products p ON p.id=f.product_id AND p.deleted_at IS NULL LEFT JOIN product_variants v ON v.id=p.default_variant_id WHERE f.user_id=? ORDER BY f.created_at DESC`, [user.id]);
  return <main dir="rtl" className="store-shell py-7 sm:py-10">
    <header className="relative overflow-hidden rounded-[20px] border border-[var(--border)] bg-[#fafaf8] px-5 py-7 sm:px-7 sm:py-8">
      <div className="absolute -left-14 -top-16 h-40 w-40 rounded-full bg-[var(--brand)]/[0.045] blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><Link href="/account" className="text-[10px] font-black text-slate-400 transition hover:text-[var(--brand)]">← حساب کاربری</Link><p className="mt-5 text-[9px] font-black text-[var(--brand)]">لیست انتخاب‌های شما</p><h1 className="mt-2 text-3xl font-black tracking-tight">علاقه‌مندی‌ها</h1><p className="mt-2 text-[11px] leading-6 text-slate-500">محصولاتی که برای خرید بعدی نگه داشته‌اید.</p></div>
        {items.length > 0 && <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-2 text-[9px] font-black text-slate-500"><span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">♥</span>{items.length.toLocaleString('fa-IR')} محصول ذخیره‌شده</div>}
      </div>
    </header>
    {items.length ? <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{items.map((p)=><Link key={p.product_id} href={`/products/${p.slug}`} className="group flex min-w-0 flex-col overflow-hidden rounded-[16px] border border-[var(--border)] bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(23,23,23,.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"><div className="relative aspect-[.92] overflow-hidden bg-[#fafaf8]">{p.thumbnail_url?<Image src={p.thumbnail_url} alt={p.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-contain p-4 transition duration-500 group-hover:scale-[1.045]"/>:<div className="flex h-full items-center justify-center text-[9px] font-bold text-slate-300">تصویر موجود نیست</div>}<span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-sm text-[var(--brand)] shadow-sm">♥</span></div><div className="flex flex-1 flex-col p-4 sm:p-5"><h2 className="line-clamp-2 text-[11px] font-black leading-6 text-slate-800 sm:text-xs">{p.name}</h2><div className="mt-auto pt-5"><p className="text-[8px] font-bold text-slate-400">قیمت فعلی</p><p className="mt-1 text-[12px] font-black sm:text-[13px]">{money(p.price)} <span className="text-[8px] font-bold text-slate-400">تومان</span></p><span className="mt-3 inline-flex text-[9px] font-black text-[var(--brand)] opacity-70 transition group-hover:opacity-100">مشاهده محصول ←</span></div></div></Link>)}</div> : <div className="mt-8 rounded-[20px] border border-dashed border-[var(--border)] bg-white px-6 py-20 text-center shadow-[0_12px_35px_rgba(23,23,23,.025)]"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--brand-soft)] text-xl text-[var(--brand)]">♥</div><h2 className="mt-5 text-xl font-black">هنوز محصولی ذخیره نکرده‌اید</h2><p className="mx-auto mt-2 max-w-sm text-[10px] leading-6 text-slate-400">محصولات موردعلاقه‌تان را هنگام مرور فروشگاه ذخیره کنید تا بعداً سریع‌تر به آن‌ها برگردید.</p><Link href="/products" className="mt-6 inline-flex rounded-[11px] bg-[var(--brand)] px-6 py-3 text-[10px] font-black text-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(225,29,72,.16)]">مشاهده محصولات</Link></div>}
  </main>;
}
