import Link from 'next/link';
import CheckoutForm from '../../components/storefront/CheckoutForm';
import { requireUser } from '../../lib/auth/session.js';
import { getUserAddresses } from '../../server/address/service.js';
import { getCart } from '../../server/cart/service.js';
import { getUserOrder } from '../../server/orders/service.js';

export const metadata = { title: 'تکمیل سفارش' };

export default async function CheckoutPage({ searchParams }) {
  let user;
  try { user = await requireUser(); } catch { return <div className="mx-auto max-w-2xl px-4 py-24 text-center"><h1 className="text-2xl font-black">برای ادامه وارد حساب شوید</h1><p className="mt-2 text-sm text-slate-500">برای انتخاب آدرس و ثبت سفارش باید وارد حساب کاربری خود شوید.</p><Link href="/login?returnTo=/checkout" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">ورود به حساب</Link></div>; }
  const params = await searchParams;
  const retryOrderId = Number(params?.orderId);

  if (Number.isSafeInteger(retryOrderId) && retryOrderId > 0) {
    const order = await getUserOrder(user.id, retryOrderId);
    if (!order) return <div className="mx-auto max-w-2xl px-4 py-24 text-center"><h1 className="text-2xl font-black">سفارش پیدا نشد</h1><p className="mt-2 text-sm text-slate-500">این سفارش وجود ندارد یا به حساب شما تعلق ندارد.</p><Link href="/orders" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">مشاهده سفارش‌ها</Link></div>;
    if (order.status !== 'PENDING' || order.paymentStatus === 'PAID') return <div className="mx-auto max-w-2xl px-4 py-24 text-center"><h1 className="text-2xl font-black">این سفارش قابل پرداخت نیست</h1><p className="mt-2 text-sm text-slate-500">وضعیت فعلی سفارش اجازه شروع پرداخت جدید را نمی‌دهد.</p><Link href={`/orders/${order.id}`} className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">بازگشت به سفارش</Link></div>;
    return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="mb-7"><p className="text-xs font-bold text-[var(--brand)]">پرداخت سفارش</p><h1 className="mt-1 text-2xl font-black">ادامه پرداخت</h1><p className="mt-2 text-sm text-slate-500">سفارش {order.orderNumber} آماده پرداخت است.</p></div><CheckoutForm addresses={[]} cart={{ items: order.items.map((item) => ({ id: item.id, product_name: item.productName, quantity: item.quantity, line_total: item.lineTotal })), subtotal: order.totalAmount }} existingOrderId={order.id} /></div>;
  }

  const [addresses, cart] = await Promise.all([getUserAddresses(user.id), getCart(user.id)]);
  if (!cart?.items?.length) return <div className="mx-auto max-w-2xl px-4 py-24 text-center"><h1 className="text-2xl font-black">سبد خرید شما خالی است</h1><p className="mt-2 text-sm text-slate-500">برای شروع خرید، ابتدا محصولی به سبد اضافه کنید.</p><Link href="/products" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">مشاهده محصولات</Link></div>;
  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="mb-7"><p className="text-xs font-bold text-[var(--brand)]">مرحله نهایی</p><h1 className="mt-1 text-2xl font-black">تکمیل سفارش</h1><p className="mt-2 text-sm text-slate-500">آدرس ارسال را انتخاب کنید و سفارش خود را ثبت کنید.</p></div><CheckoutForm addresses={addresses} cart={cart} /></div>;
}
