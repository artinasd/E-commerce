'use client';

import { useState } from 'react';
import Link from 'next/link';

const statusLabels = { DRAFT: 'پیش‌نویس', ACTIVE: 'فعال', ARCHIVED: 'بایگانی' };

export default function AdminProductsTable({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  async function removeProduct(product) {
    if (!window.confirm(`آیا از حذف «${product.name}» مطمئن هستید؟`)) return;
    setBusyId(product.id);
    setError('');
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message || 'حذف محصول انجام نشد.');
      setProducts((current) => current.filter((item) => item.id !== product.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-right text-sm">
          <thead className="border-b bg-slate-50"><tr><th className="p-4">محصول</th><th className="p-4">وضعیت</th><th className="p-4">تنوع‌ها</th><th className="p-4">موجودی قابل فروش</th><th className="p-4">شناسه</th><th className="p-4">عملیات</th></tr></thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="transition hover:bg-slate-50/70">
                <td className="p-4"><div className="font-extrabold">{product.name}</div><div className="mt-1 text-xs text-slate-400">{product.slug}</div></td>
                <td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${product.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : product.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{statusLabels[product.status]}</span></td>
                <td className="p-4">{product.variant_count}</td>
                <td className="p-4 font-bold">{product.available_units}</td>
                <td className="p-4 font-mono text-xs">{product.id}</td>
                <td className="p-4"><div className="flex items-center gap-2"><Link href={`/admin/products/${product.id}`} className="rounded-lg border bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50">ویرایش</Link><button type="button" disabled={busyId === product.id} onClick={() => removeProduct(product)} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50">{busyId === product.id ? 'در حال حذف…' : 'حذف'}</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <div className="p-10 text-center text-slate-500">محصولی پیدا نشد.</div>}
      </div>
    </div>
  );
}
