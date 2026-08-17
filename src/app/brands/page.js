import Image from 'next/image';
import Link from 'next/link';
import { getBrands } from '../../server/catalog/service.js';

export const metadata = { title: 'برندها' };

export default async function BrandsPage() {
  const brands = await getBrands({ limit: 250 });
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-bold text-[var(--brand)]">فروشگاه</p>
      <h1 className="mt-1 text-2xl font-black tracking-tight">برندها</h1>
      <p className="mt-2 text-sm text-slate-500">برند موردعلاقه‌تان را انتخاب کنید و محصولاتش را ببینید.</p>
      {brands.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-[var(--border)] bg-white p-16 text-center text-sm text-slate-500">برند فعالی ثبت نشده است.</div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {brands.map((brand) => (
            <Link key={brand.id} href={`/products?brand=${encodeURIComponent(brand.slug)}`} className="group rounded-2xl border border-[var(--border)] bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5">
              <div className="relative flex aspect-[1.7] items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-4">
                {brand.logo_url ? <Image src={brand.logo_url} alt={brand.name} fill sizes="(max-width: 640px) 42vw, (max-width: 1024px) 25vw, 18vw" className="object-contain p-4" /> : <span className="text-center text-lg font-black text-slate-700">{brand.name}</span>}
              </div>
              {brand.description && <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">{brand.description}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
