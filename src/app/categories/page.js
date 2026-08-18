import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '../../server/catalog/service.js';

export const metadata = { title: 'دسته‌بندی‌ها' };
export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="store-shell py-8 sm:py-10">
      <section className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_16px_50px_rgba(23,23,23,.045)] sm:p-9">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-[11px] font-black text-[var(--brand)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />دسته‌بندی فروشگاه</div>
          <h1 className="mt-2 text-3xl font-black tracking-tight">چه چیزی می‌خواهید پیدا کنید؟</h1>
          <p className="mt-3 text-[12px] leading-7 text-slate-500">دسته موردنظر را انتخاب کنید تا مستقیماً وارد محصولات همان بخش شوید.</p>
        </div>
      </section>
      {categories.length === 0 ? <div className="mt-6 rounded-[24px] border border-[var(--border)] bg-white p-16 text-center text-[11px] text-slate-500">دسته‌بندی فعالی ثبت نشده است.</div> : <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {categories.map((category) => <Link key={category.id} href={`/products?category=${encodeURIComponent(category.slug)}`} className="group overflow-hidden rounded-[22px] border border-[var(--border)] bg-white transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_22px_55px_rgba(23,23,23,.08)]">
          <div className="relative aspect-[1.05] overflow-hidden bg-[#f4f4f1]">{category.image_url ? <Image src={category.image_url} alt={category.name} fill sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 20vw" className="object-cover transition duration-500 group-hover:scale-[1.05]" /> : <div className="flex h-full items-center justify-center text-4xl font-black text-slate-200">{category.name.slice(0, 1)}</div>}<div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent opacity-70" /></div>
          <div className="flex items-center justify-between gap-3 p-4"><div className="min-w-0"><h2 className="truncate text-[13px] font-black">{category.name}</h2>{category.description && <p className="mt-1 line-clamp-1 text-[10px] text-slate-400">{category.description}</p>}</div><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-50 text-slate-400 transition group-hover:bg-[var(--brand-soft)] group-hover:text-[var(--brand)]">←</span></div>
        </Link>)}
      </div>}
    </div>
  );
}
