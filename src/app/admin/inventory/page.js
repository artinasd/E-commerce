import { listAdminInventory } from '../../../server/admin/inventory.js';

export default async function AdminInventoryPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search?.trim() || null;
  const rows = await listAdminInventory({ search, limit: 100, offset: 0 });
  return (
    <section dir="rtl">
      <div className="mb-6">
        <p className="text-sm font-semibold text-slate-500">مدیریت انبار</p>
        <h1 className="mt-1 text-3xl font-black">موجودی کالا</h1>
      </div>
      <form className="mb-5 flex gap-2" method="get">
        <input name="search" defaultValue={search ?? ''} placeholder="جستجوی محصول، SKU یا تنوع" className="min-w-0 flex-1 rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2" />
        <button className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white">جستجو</button>
      </form>
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-right text-sm">
          <thead className="border-b bg-slate-50"><tr><th className="p-4">محصول</th><th className="p-4">SKU</th><th className="p-4">تنوع</th><th className="p-4">موجودی</th><th className="p-4">رزرو</th><th className="p-4">قابل فروش</th><th className="p-4">حد هشدار</th></tr></thead>
          <tbody className="divide-y">
            {rows.map((row) => <tr key={row.id} className={Number(row.available_quantity) <= Number(row.low_stock_threshold) ? 'bg-amber-50' : ''}><td className="p-4 font-bold">{row.product_name}</td><td className="p-4 font-mono text-xs">{row.sku}</td><td className="p-4">{row.variant_name || '—'}</td><td className="p-4">{row.quantity}</td><td className="p-4">{row.reserved_quantity}</td><td className="p-4 font-bold">{row.available_quantity}</td><td className="p-4">{row.low_stock_threshold}</td></tr>)}
          </tbody>
        </table>
        {rows.length === 0 && <div className="p-10 text-center text-slate-500">موردی پیدا نشد.</div>}
      </div>
    </section>
  );
}
