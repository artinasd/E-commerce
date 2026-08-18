import Image from 'next/image';
import Link from 'next/link';
import { getBrands } from '../../server/catalog/service.js';

export const metadata = { title: 'برندها' };
export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
  const brands = await getBrands({ limit: 250 });
  return <main dir="rtl" className="store-shell py-8 sm:py-10"><header className="border-b border-[var(--border)] pb-7"><p className="text-[9px] font-black text-[var(--brand)]">برندهای منتخب</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">برندها</h1><p className="mt-3 max-w-2xl text-[11px] leading-7 text-slate-500">برند موردنظر را انتخاب کنید و محصولات آن را یکجا ببینید.</p></header>{brands.length === 0 ? <div className="mt-8 border-y border-[var(--border)] bg-white p-16 text-center text-[11px] text-slate-500">برند فعالی ثبت نشده است.</div> : <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">{brands.map((brand) => <Link key={brand.id} href={`/products?brand=${encodeURIComponent(brand.slug)}`} className="group border border-[var(--border)] bg-white p-3 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_35px_rgba(23,23,23,.06)]"><div className="relative flex aspect-[1.7] items-center justify-center overflow-hidden bg-[#f7f7f4]">{brand.logo_url ? <Image src={brand.logo_url} alt={brand.name} fill sizes="(max-width:640px) 44vw, (max-width:1024px) 25vw, 16vw" className="object-contain p-5 transition duration-300 group-hover:scale-105"/> : <span className="px-3 text-center text-[11px] font-black text-slate-700">{brand.name}</span>}</div><div className="flex items-center justify-between gap-2 px-1 pb-1 pt-3"><span className="truncate text-[10px] font-black">{brand.name}</span><span className="text-slate-300 transition group-hover:text-[var(--brand)]">←</span></div></Link>)}</div>}</main>;
}
