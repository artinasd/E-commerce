import Link from 'next/link';
import { requireRole } from '../../lib/auth/session.js';

const nav = [
  ['داشبورد', '/admin'],
  ['نظرات', '/admin/reviews'],
  ['محصولات', '/admin/products'],
  ['موجودی', '/admin/inventory'],
  ['سفارش‌ها', '/admin/orders'],
  ['مشتریان', '/admin/customers'],
];

export default async function AdminLayout({ children }) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
        <aside className="w-full border-b bg-white p-5 md:w-64 md:border-b-0 md:border-l">
          <Link href="/admin" className="text-xl font-black">مدیریت فروشگاه</Link>
          <nav className="mt-6 grid gap-1">
            {nav.map(([label, href]) => <Link key={href} href={href} className="rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-slate-100">{label}</Link>)}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
