import Image from 'next/image';
import Link from 'next/link';
import { getCategories } from '../../server/catalog/service.js';

export const metadata = { title: 'دسته‌بندی‌ها' };
export const dynamic = 'force-dynamic';

function buildCategoryTree(categories) {
  const byParent = new Map();
  for (const category of categories) {
    const parentId = category.parent_id == null ? null : Number(category.parent_id);
    if (!byParent.has(parentId)) byParent.set(parentId, []);
    byParent.get(parentId).push(category);
  }
  return byParent;
}

function ChildMenuItem({ category, childrenByParent }) {
  const children = childrenByParent.get(Number(category.id)) || [];
  return <div className="group/item relative">
    <Link href={`/products?category=${encodeURIComponent(category.slug)}`} className="flex items-center gap-3 px-4 py-3 text-right transition hover:bg-slate-50">
      <span className="min-w-0 flex-1 truncate text-[11px] font-bold text-slate-700 group-hover/item:text-[var(--brand)]">{category.name}</span>
      {children.length > 0 && <span className="text-[11px] text-slate-300 transition group-hover/item:text-[var(--brand)]">‹</span>}
    </Link>
    {children.length > 0 && <div className="invisible absolute right-full top-0 z-50 mr-2 w-52 translate-x-2 opacity-0 transition-all duration-150 group-hover/item:visible group-hover/item:translate-x-0 group-hover/item:opacity-100">
      <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
        <div className="border-b border-slate-100 px-4 py-3"><p className="text-[9px] font-black uppercase tracking-widest text-[var(--brand)]">زیرمجموعه</p><p className="mt-1 truncate text-xs font-black text-slate-900">{category.name}</p></div>
        {children.map((child) => <ChildMenuItem key={child.id} category={child} childrenByParent={childrenByParent}/>)}
      </div>
    </div>}
  </div>;
}

function CategoryCard({ category, childrenByParent }) {
  const children = childrenByParent.get(Number(category.id)) || [];
  return <article className="group/card relative min-w-0">
    <Link href={`/products?category=${encodeURIComponent(category.slug)}`} className="group block bg-white">
      <div className="relative aspect-[1.15] overflow-hidden bg-[#f5f5f2]">
        {category.image_url ? <Image src={category.image_url} alt={category.name} fill sizes="(max-width:640px) 48vw, (max-width:1024px) 32vw, 20vw" className="object-cover transition duration-500 group-hover:scale-[1.04]"/> : <div className="grid h-full place-items-center text-3xl font-black text-slate-200">{category.name?.slice(0,1)}</div>}
        {children.length > 0 && <span aria-hidden="true" className="absolute bottom-3 left-3 grid h-8 w-8 place-items-center border border-white/70 bg-white/90 text-slate-500 shadow-sm backdrop-blur transition group-hover:bg-white group-hover:text-[var(--brand)]">⌄</span>}
      </div>
      <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] py-4">
        <div className="min-w-0"><h2 className="truncate text-[11px] font-black">{category.name}</h2>{category.description && <p className="mt-1 line-clamp-1 text-[9px] text-slate-400">{category.description}</p>}</div>
        <span className="pt-0.5 text-xs text-slate-300 transition group-hover:text-[var(--brand)]">←</span>
      </div>
    </Link>
    {children.length > 0 && <div className="invisible absolute right-0 top-full z-40 mt-2 w-[min(21rem,calc(100vw-2rem))] translate-y-2 opacity-0 transition-all duration-200 group-hover/card:visible group-hover/card:translate-y-0 group-hover/card:opacity-100">
      <div className="overflow-visible border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div><p className="text-[9px] font-black uppercase tracking-[0.16em] text-[var(--brand)]">دسته‌های مرتبط</p><p className="mt-1 text-sm font-black text-slate-900">{category.name}</p></div>
          <span className="text-xs text-slate-300">{children.length} مورد</span>
        </div>
        <div className="py-1">{children.map((child) => <ChildMenuItem key={child.id} category={child} childrenByParent={childrenByParent}/>)}</div>
      </div>
    </div>}
  </article>;
}

export default async function CategoriesPage() {
  const categories = await getCategories({ all: true });
  const childrenByParent = buildCategoryTree(categories);
  const roots = childrenByParent.get(null) || [];
  return <main dir="rtl" className="store-shell py-8 sm:py-10">
    <header className="border-b border-[var(--border)] pb-7"><p className="text-[9px] font-black text-[var(--brand)]">کشف محصولات</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">دسته‌بندی‌ها</h1><p className="mt-3 max-w-2xl text-[11px] leading-7 text-slate-500">از اینجا مستقیم وارد بخشی شوید که دنبال آن هستید.</p></header>
    {roots.length === 0 ? <div className="mt-8 border-y border-[var(--border)] bg-white p-16 text-center text-[11px] text-slate-500">دسته‌بندی فعالی ثبت نشده است.</div> : <div className="mt-8 grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{roots.map((category) => <CategoryCard key={category.id} category={category} childrenByParent={childrenByParent}/>)}</div>}
  </main>;
}
