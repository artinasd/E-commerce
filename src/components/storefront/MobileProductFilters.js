'use client';

import { useState } from 'react';

export default function MobileProductFilters({ params, categories, brands, activeFilterCount }) {
  const [open, setOpen] = useState(false);
  const hasStock = ['1', 'true', 'yes'].includes(String(params.inStock || '').toLowerCase());

  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => setOpen(true)} className="inline-flex h-11 items-center gap-2 border border-[var(--border)] bg-white px-4 text-[10px] font-black text-slate-800 shadow-sm transition hover:border-slate-300">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" /></svg>
        فیلترها
        {activeFilterCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[var(--brand)] px-1 text-[8px] text-white">{activeFilterCount.toLocaleString('fa-IR')}</span>}
      </button>

      {open && <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="فیلتر محصولات">
        <button type="button" className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]" onClick={() => setOpen(false)} aria-label="بستن فیلترها" />
        <aside className="absolute bottom-0 right-0 top-0 w-[min(88vw,390px)] overflow-y-auto bg-white shadow-[-20px_0_60px_rgba(0,0,0,.12)]">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-white/95 px-5 py-4 backdrop-blur">
            <div><p className="text-[9px] font-black uppercase tracking-[.15em] text-[var(--brand)]">فیلتر محصولات</p><h2 className="mt-1 text-base font-black">محصول مناسب را پیدا کنید</h2></div>
            <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center border border-[var(--border)] text-slate-500 transition hover:border-slate-300 hover:text-slate-950" aria-label="بستن">×</button>
          </div>
          <form method="get" className="space-y-5 p-5">
            {params.search ? <input type="hidden" name="search" value={params.search} /> : null}
            <input type="hidden" name="sort" value={params.sort || 'created_at'} />
            <input type="hidden" name="direction" value={params.direction || 'desc'} />
            <label className="grid gap-2 text-[10px] font-black text-slate-500">دسته‌بندی<select name="category" defaultValue={params.category || ''} className="h-11 rounded-[10px] border border-[var(--border)] bg-white px-3 text-[10px] font-bold text-slate-700 outline-none focus:border-[var(--brand)]"><option value="">همه دسته‌بندی‌ها</option>{categories.map((category) => <option key={category.id} value={category.slug}>{category.parent_id ? `↳ ${category.name}` : category.name}</option>)}</select></label>
            <label className="grid gap-2 text-[10px] font-black text-slate-500">برند<select name="brand" defaultValue={params.brand || ''} className="h-11 rounded-[10px] border border-[var(--border)] bg-white px-3 text-[10px] font-bold text-slate-700 outline-none focus:border-[var(--brand)]"><option value="">همه برندها</option>{brands.map((brand) => <option key={brand.id} value={brand.slug}>{brand.name}</option>)}</select></label>
            <div><p className="text-[10px] font-black text-slate-500">بازه قیمت (تومان)</p><div className="mt-2 grid grid-cols-2 gap-2"><input name="minPrice" inputMode="numeric" placeholder="از" defaultValue={params.minPrice || ''} className="h-11 rounded-[10px] border border-[var(--border)] px-2.5 text-[10px] outline-none focus:border-[var(--brand)]" /><input name="maxPrice" inputMode="numeric" placeholder="تا" defaultValue={params.maxPrice || ''} className="h-11 rounded-[10px] border border-[var(--border)] px-2.5 text-[10px] outline-none focus:border-[var(--brand)]" /></div></div>
            <label className="flex cursor-pointer items-center gap-2.5 border-t border-[var(--border)] pt-4 text-[10px] font-bold text-slate-600"><input type="checkbox" name="inStock" value="1" defaultChecked={hasStock} className="h-4 w-4 accent-[var(--brand)]" />فقط کالاهای موجود</label>
            <div className="sticky bottom-0 border-t border-[var(--border)] bg-white pt-4"><button type="submit" className="h-12 w-full bg-slate-950 text-[10px] font-black text-white transition hover:bg-[var(--brand)]">اعمال فیلترها</button></div>
          </form>
        </aside>
      </div>}
    </div>
  );
}
