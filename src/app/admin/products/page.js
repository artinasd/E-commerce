import Link from 'next/link';
import AdminProductsTable from '../../../components/admin/AdminProductsTable.js';
import { listAdminProducts } from '../../../server/admin/products.js';

export default async function AdminProductsPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search?.trim() || null;
  const products = await listAdminProducts({ search, limit: 100, offset: 0 });
  return <section dir="rtl">
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-500">کاتالوگ</p>
        <h1 className="mt-1 text-3xl font-black">محصولات</h1>
        <p className="mt-2 text-sm text-slate-500">از اینجا محصولات را مدیریت، ویرایش و حذف کنید.</p>
      </div>

      <div className="flex gap-2">
        {/* ✅ FIXED: Replaced bg-slate-950 with Outline style (White bg, Red border, Red text) */}
        <Link
            href="/admin/products/new"
            className="rounded-xl bg-white border-2 border-[var(--brand)] px-4 py-2 text-sm font-bold text-[var(--brand)] transition hover:bg-[var(--brand)] hover:text-white"
        >
          افزودن محصول
        </Link>

        <Link href="/products" className="rounded-xl border bg-white px-4 py-2 text-sm font-bold">مشاهده فروشگاه</Link>
      </div>
    </div>

    <form className="mb-5 flex gap-2" method="get">
      <input name="search" defaultValue={search ?? ''} placeholder="جستجوی نام، اسلاگ یا SKU" className="min-w-0 flex-1 rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2" />
      {/* Optional: The search button also uses slate-950, left unchanged here, but you could apply the same outline approach to it if you want all slate-950 gone */}
      <button className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white">جستجو</button>
    </form>

    <AdminProductsTable initialProducts={products} />
  </section>;}
