import Link from 'next/link';
import { requireUser } from '../../lib/auth/session.js';
import { listUserOrders } from '../../server/orders/service.js';

export const metadata = { title: 'سفارش‌های من' };

function price(value) { return new Intl.NumberFormat('fa-IR').format(Number(value || 0)); }
function statusLabel(status) { return ({ PENDING: 'در انتظار پرداخت', PAID: 'پرداخت شده', PROCESSING: 'در حال پردازش', SHIPPED: 'ارسال شده', DELIVERED: 'تحویل شده', CANCELLED: 'لغو شده', REFUNDED: 'مرجوع شده' })[status] || status; }
function paymentLabel(status) { return ({ UNPAID: 'پرداخت نشده', PAID: 'پرداخت شده', FAILED: 'ناموفق', REFUNDED: 'بازپرداخت شده' })[status] || status; }

export default async function OrdersPage({ searchParams }) {
  try {
    const user = await requireUser();
    const params = await searchParams;
    const result = await listUserOrders(user.id, { page: Math.max(Number(params.page) || 1, 1), limit: 20 });
    return <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8"><div><p className="text-xs font-bold text-[var(--brand)]">حساب کاربری</p><h1 className="mt-1 text-2xl font-black">سفارش‌های من</h1></div>{!result.orders.length ? <div className="mt-7 rounded-2xl border border-[var(--border)] bg-white px-6 py-16 text-center"><h2 className="font-bold">هنوز سفارشی ثبت نکرده‌اید</h2><p className="mt-2 text-sm text-slate-500">اولین خریدتان را شروع کنید.</p><Link href="/products" className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">مشاهده محصولات</Link></div> : <div className="mt-7 grid gap-3">{result.orders.map((order) => <Link key={order.id} href={`/orders/${order.id}`} className="rounded-2xl border border-[var(--border)] bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs text-slate-400">شماره سفارش</p><p className="mt-1 font-black tracking-wide">{order.orderNumber}</p></div><div className="flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-slate-100 px-3 py-1.5 font-semibold">{statusLabel(order.status)}</span><span className="rounded-full bg-slate-50 px-3 py-1.5 font-semibold text-slate-500">{paymentLabel(order.paymentStatus)}</span></div></div><div className="mt-5 flex flex-wrap justify-between gap-4 border-t border-[var(--border)] pt-4 text-sm"><span className="text-slate-500">مبلغ سفارش</span><strong>{price(order.totalAmount)} تومان</strong></div></Link>)}</div>}{result.pagination.hasMore && <div className="mt-7 text-center"><Link href={`/orders?page=${Number(result.pagination.page) + 1}`} className="inline-flex rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold">سفارش‌های قدیمی‌تر</Link></div>}</div>;
  } catch { return <div className="mx-auto max-w-2xl px-4 py-24 text-center"><h1 className="text-2xl font-black">برای مشاهده سفارش‌ها وارد شوید</h1><p className="mt-2 text-sm text-slate-500">سفارش‌های شما فقط برای حساب خودتان قابل مشاهده هستند.</p><Link href="/login?returnTo=/orders" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">ورود به حساب</Link></div>; }
}
