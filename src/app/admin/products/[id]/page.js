import Link from 'next/link';
import { requireRole } from '../../../../lib/auth/session.js';
import { query } from '../../../../server/db/connection.js';

export default async function AdminProductEditor({ params }) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  const { id } = await params;
  const rows = await query(`SELECT p.id, p.name, p.slug, p.short_description, p.description, p.status, p.featured, v.id AS variant_id, v.sku, v.name AS variant_name, v.price, v.compare_at_price, i.quantity, i.reserved_quantity, i.low_stock_threshold FROM products p LEFT JOIN product_variants v ON v.product_id = p.id AND v.deleted_at IS NULL LEFT JOIN inventory i ON i.variant_id = v.id WHERE p.id = ? AND p.deleted_at IS NULL`, [id]);
  if (!rows.length) return <div dir="rtl">محصول پیدا نشد.</div>;
  const product = rows[0];
  const variants = rows.filter((row) => row.variant_id);
  return <section dir="rtl"><div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-slate-500">ویرایش محصول</p><h1 className="mt-1 text-3xl font-black">{product.name}</h1><p className="mt-1 text-sm text-slate-500">{product.slug}</p></div><Link href="/admin/products" className="rounded-xl border bg-white px-4 py-2 text-sm font-bold">بازگشت</Link></div><div className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="text-xl font-black">تنوع‌ها و قیمت</h2><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-right text-sm"><thead className="border-b bg-slate-50"><tr><th className="p-3">SKU</th><th className="p-3">نام</th><th className="p-3">قیمت</th><th className="p-3">موجودی</th><th className="p-3">رزرو</th><th className="p-3">قابل فروش</th></tr></thead><tbody className="divide-y">{variants.map((variant) => <tr key={variant.variant_id}><td className="p-3 font-mono text-xs">{variant.sku}</td><td className="p-3">{variant.variant_name || '—'}</td><td className="p-3 font-bold">{Number(variant.price).toLocaleString('fa-IR')} تومان</td><td className="p-3">{variant.quantity}</td><td className="p-3">{variant.reserved_quantity}</td><td className="p-3 font-bold">{Math.max(Number(variant.quantity) - Number(variant.reserved_quantity), 0)}</td></tr>)}</tbody></table></div>{variants.length === 0 && <p className="mt-6 text-sm text-slate-500">هنوز تنوعی برای این محصول ایجاد نشده است.</p>}</div></section>;
}
