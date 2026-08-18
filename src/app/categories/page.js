import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '../../server/catalog/service.js';

export const metadata = { title: 'دسته‌بندی‌ها' };
export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const categories = await getCategories();
  return <main dir="rtl" className="store-shell py-8 sm:py-10"><header className="border-b border-[var(--border)] pb-7"><p className="text-[9px] font-black text-[var(--brand)]">کشف محصولات</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">دسته‌بندی‌ها</h1><p className="mt-3 max-w-2xl text-[11px] leading-7 text-slate-500">از اینجا مستقیم وارد بخشی شوید که دنبال آن هستید.</p></header>{categories.length === 0 ? <div className="mt-8 border-y border-[var(--border)] bg-white p-16 text-center text-[11px] text-slate-500">دسته‌بندی فعالی ثبت نشده است.</div> : <div className="mt-8 grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{categories.map((category) => <Link key={category.id} href={`/products?category=${encodeURIComponent(category.slug)}`} className="group border-b border-[var(--border)] bg-white p-3 transition hover:bg-[#fafaf8]"><div className="relative aspect-[1.15] overflow-hidden bg-[#f5f5f2]">{category.image_url ? <Image src={category.image_url} alt={category.name} fill sizes="(max-width:640px) 48vw, (max-width:1024px) 32vw, 20vw" className="object-cover transition duration-500 group-hover:scale-[1.04]"/> : <div className="grid h-full place-items-center text-3xl font-black text-slate-200">{category.name?.slice(0,1)}</div>}</div><div className="flex items-start justify-between gap-3 py-4"><div className="min-w-0"><h2 className="truncate text-[11px] font-black">{category.name}</h2>{category.description && <p className="mt-1 line-clamp-1 text-[9px] text-slate-400">{category.description}</p>}</div><span className="pt-0.5 text-xs text-slate-300 transition group-hover:text-[var(--brand)]">←</span></div></Link>)}</div>}</main>;
}
