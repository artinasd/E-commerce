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

function CategoryCard({ category, childrenByParent, level = 0 }) {
  const children = childrenByParent.get(Number(category.id)) || [];
  return <section className={level ? 'mt-4' : ''}>
    <Link href={`/products?category=${encodeURIComponent(category.slug)}`} className="group block border border-[var(--border)] bg-white p-3 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm">
      <div className="relative aspect-[1.35] overflow-hidden bg-[#f5f5f2]">{category.image_url ? <Image src={category.image_url} alt={category.name} fill sizes="(max-width:640px) 90vw, (max-width:1024px) 45vw, 28vw" className="object-cover transition duration-500 group-hover:scale-[1.04]"/> : <div className="grid h-full place-items-center text-4xl font-black text-slate-200">{category.name?.slice(0,1)}</div>}</div>
      <div className="flex items-start justify-between gap-3 py-4"><div className="min-w-0"><h2 className="text-[12px] font-black">{category.name}</h2>{category.description && <p className="mt-1 line-clamp-1 text-[9px] text-slate-400">{category.description}</p>}</div><span className="pt-0.5 text-xs text-slate-300 transition group-hover:text-[var(--brand)]">←</span></div>
    </Link>
    {children.length > 0 && <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{children.map((child) => <CategoryCard key={child.id} category={child} childrenByParent={childrenByParent} level={level + 1}/>)}</div>}
  </section>;
}

export default async function CategoriesPage() {
  const categories = await getCategories({ all: true });
  const childrenByParent = buildCategoryTree(categories);
  const roots = childrenByParent.get(null) || [];
  return <main dir="rtl" className="store-shell py-8 sm:py-10"><header className="border-b border-[var(--border)] pb-7"><p className="text-[9px] font-black text-[var(--brand)]">کشف محصولات</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">دسته‌بندی‌ها</h1><p className="mt-3 max-w-2xl text-[11px] leading-7 text-slate-500">از اینجا مستقیم وارد بخشی شوید که دنبال آن هستید. دسته‌بندی‌های زیرمجموعه هم در زیر دسته اصلی نمایش داده می‌شوند.</p></header>{roots.length === 0 ? <div className="mt-8 border-y border-[var(--border)] bg-white p-16 text-center text-[11px] text-slate-500">دسته‌بندی فعالی ثبت نشده است.</div> : <div className="mt-8 space-y-8">{roots.map((category) => <CategoryCard key={category.id} category={category} childrenByParent={childrenByParent}/>)}</div>}</main>;
}
