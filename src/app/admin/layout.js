import Link from 'next/link';
import { requireRole } from '../../lib/auth/session.js';

const nav = [['داشبورد','/admin','⌂'],['محصولات','/admin/products','▦'],['برندها و دسته‌بندی‌ها','/admin/catalog','◇'],['نظرات','/admin/reviews','◌'],['موجودی','/admin/inventory','▤'],['ارسال و هزینه‌ها','/admin/shipping','▱'],['سفارش‌ها','/admin/orders','↗'],['مشتریان','/admin/customers','◎']];

export default async function AdminLayout({ children }) {
  await requireRole(['ADMIN','SUPER_ADMIN']);
  return <div dir="rtl" className="min-h-screen bg-[#f6f6f3] text-[#171717]"><div className="mx-auto flex min-h-screen max-w-[1500px] flex-col md:flex-row">
    <aside className="w-full shrink-0 border-b border-[var(--border)] bg-white md:w-[250px] md:border-b-0 md:border-l"><div className="sticky top-0 p-5 md:p-6"><Link href="/admin" className="flex items-center gap-3 border-b border-[var(--border)] pb-6"><span className="grid h-10 w-10 place-items-center rounded-[11px] bg-[var(--brand)] text-sm font-black text-white">ف</span><span><b className="block text-[13px] font-black">مدیریت فروشگاه</b><small className="mt-0.5 block text-[8px] font-bold text-slate-400">پنل مدیریت</small></span></Link><nav className="mt-5 flex gap-1 overflow-x-auto md:grid">{nav.map(([label,href,icon])=><Link key={href} href={href} className="group flex shrink-0 items-center gap-3 border-b-2 border-transparent px-3 py-3 text-[10px] font-extrabold text-slate-500 transition hover:border-[var(--brand)] hover:bg-[#fafaf8] hover:text-slate-950 md:rounded-[9px] md:border-b-0"><span className="w-5 text-center text-xs text-slate-300 group-hover:text-[var(--brand)]">{icon}</span>{label}</Link>)}</nav><Link href="/" className="mt-6 hidden border-t border-[var(--border)] pt-5 text-[9px] font-bold text-slate-400 hover:text-[var(--brand)] md:block">← بازگشت به فروشگاه</Link></div></aside>
    <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-9">{children}</main>
  </div></div>;
}
