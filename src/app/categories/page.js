import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '../../server/catalog/service.js';

export const metadata = { title: 'دسته‌بندی‌ها' };
export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await getCategories();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-xs font-bold text-[var(--brand)]">فروشگاه</p>
      <h1 className="mt-1 text-2xl font-black tracking-tight">دسته‌بندی‌ها</h1>
      <p className="mt-2 text-sm text-slate-500">محصولات را بر اساس دسته موردنظر پیدا کنید.</p>
      {categories.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-[var(--border)] bg-white p-16 text-center text-sm text-slate-500">دسته‌بندی فعالی ثبت نشده است.</div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${encodeURIComponent(category.slug)}`} className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-white transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                {category.image_url ? <Image src={category.image_url} alt={category.name} fill sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 25vw" className="object-cover transition duration-300 group-hover:scale-[1.03]" /> : <div className="flex h-full items-center justify-center text-3xl font-black text-slate-200">{category.name.slice(0, 1)}</div>}
              </div>
              <div className="p-4"><h2 className="font-black">{category.name}</h2>{category.description && <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{category.description}</p>}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
