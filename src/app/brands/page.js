import Image from 'next/image';
import Link from 'next/link';
import { getBrands } from '../../server/catalog/service.js';

export const metadata = { title: 'برندها' };
export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
  const brands = await getBrands({ limit: 250 });
  return (
    <div className="store-shell py-8 sm:py-10">
      <section className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_16px_50px_rgba(23,23,23,.045)] sm:p-9">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-[11px] font-black text-[var(--brand)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />برندها</div>
          <h1 className="mt-2 text-3xl font-black tracking-tight">برند موردعلاقه‌تان را انتخاب کنید</h1>
          <p className="mt-3 text-[12px] leading-7 text-slate-500">برندها را مرور کنید و با یک انتخاب، تمام محصولات همان برند را ببینید.</p>
        </div>
      </section>
      {brands.length === 0 ? <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-white p-16 text-center text-[11px] text-slate-500">برند فعالی ثبت نشده است.</div> : <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {brands.map((brand) => <Link key={brand.id} href={`/products?brand=${encodeURIComponent(brand.slug)}`} className="group rounded-[20px] border border-[var(--border)] bg-white p-3 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(23,23,23,.07)]">
          <div className="relative flex aspect-[1.6] items-center justify-center overflow-hidden rounded-[14px] bg-[#f6f6f3]">{brand.logo_url ? <Image src={brand.logo_url} alt={brand.name} fill sizes="(max-width: 640px) 44vw, (max-width: 1024px) 25vw, 16vw" className="object-contain p-5 transition duration-300 group-hover:scale-105" /> : <span className="px-3 text-center text-[13px] font-black text-slate-700">{brand.name}</span>}</div>
          <div className="flex items-center justify-between gap-2 px-1 pb-1 pt-3"><span className="truncate text-[11px] font-black">{brand.name}</span><span className="text-slate-300 transition group-hover:text-[var(--brand)]">←</span></div>
        </Link>)}
      </div>}
    </div>
  );
}
