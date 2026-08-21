import Image from 'next/image';
import Link from 'next/link';
import { getBrands } from '../../server/catalog/service.js';

export const metadata = { title: 'برندها' };
export const dynamic = 'force-dynamic';

function ArrowIcon() { return <svg viewBox="0 0 20 20" aria-hidden="true" className="h-3.5 w-3.5 fill-none stroke-current stroke-2"><path d="m8 4 5 6-5 6" /></svg>; }

export default async function BrandsPage() {
  const brands = await getBrands({ limit: 250 });
  return <main dir="rtl" className="store-shell py-8 sm:py-10">
    <header className="relative overflow-hidden border border-[var(--border)] bg-[#fafaf8] px-6 py-8 sm:px-8 sm:py-10">
      <div className="absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[var(--brand)]/[0.05] blur-3xl" />
      <div className="relative max-w-2xl"><p className="text-[9px] font-black text-[var(--brand)]">برندهای منتخب</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">برندها</h1><p className="mt-3 text-[11px] leading-7 text-slate-500">برند موردنظر را انتخاب کنید و محصولات آن را یکجا ببینید.</p></div>
      <div className="relative mt-7 flex items-center gap-2 text-[9px] font-black text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" /> {brands.length.toLocaleString('fa-IR')} برند قابل مشاهده</div>
    </header>
    {brands.length === 0 ? <div className="mt-8 border-y border-[var(--border)] bg-white p-16 text-center text-[11px] text-slate-500">برند فعالی ثبت نشده است.</div> : <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{brands.map((brand) => <Link key={brand.id} href={`/products?brand=${encodeURIComponent(brand.slug)}`} className="group relative min-w-0 overflow-hidden rounded-[18px] border border-[var(--border)] bg-white p-2.5 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_22px_50px_rgba(23,23,23,.08)]"><div className="absolute -left-8 -top-8 h-20 w-20 rounded-full bg-[var(--brand)]/[0.05] blur-xl opacity-0 transition duration-300 group-hover:opacity-100"/><div className="relative flex aspect-[1.55] items-center justify-center overflow-hidden rounded-[13px] bg-[#f7f6f2]">{brand.logo_url ? <Image src={brand.logo_url} alt={brand.name} fill sizes="(max-width:640px) 44vw, (max-width:1024px) 25vw, 16vw" className="object-contain p-5 transition duration-500 group-hover:scale-[1.06]"/> : <span className="px-3 text-center text-[11px] font-black text-slate-700">{brand.name}</span>}<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/[0.06] to-transparent opacity-0 transition group-hover:opacity-100"/></div><div className="flex items-center justify-between gap-2 px-1 pb-1 pt-3.5"><span className="truncate text-[11px] font-black text-slate-800 transition group-hover:text-[var(--brand)]">{brand.name}</span><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--border)] text-slate-300 transition group-hover:border-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-white"><ArrowIcon/></span></div><p className="px-1 pb-1 text-[8px] font-bold text-slate-400 transition group-hover:text-slate-500">مشاهده محصولات</p></Link>)}</div>}
  </main>;
}
