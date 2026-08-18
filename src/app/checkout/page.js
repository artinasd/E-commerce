import Link from 'next/link';
import CheckoutForm from '../../components/storefront/CheckoutForm';
import { requireUser } from '../../lib/auth/session.js';
import { getUserAddresses } from '../../server/address/service.js';
import { getCart } from '../../server/cart/service.js';
import { getUserOrder } from '../../server/orders/service.js';

export const metadata = { title: 'تکمیل سفارش' };
const Shell = ({ eyebrow, title, children }) => <div className="store-shell py-7 sm:py-10"><div className="mb-8"><div className="flex items-center gap-2 text-[10px] font-black text-[var(--brand)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]"/>{eyebrow}</div><h1 className="mt-2 text-3xl font-black tracking-tight">{title}</h1><p className="mt-2 text-[11px] leading-6 text-slate-500">آرام و مرحله‌به‌مرحله اطلاعات سفارش را تکمیل کنید.</p></div>{children}</div>;
export default async function CheckoutPage({ searchParams }) {
  let user;
  try { user = await requireUser(); } catch { return <Shell eyebrow="ورود لازم است" title="قبل از ادامه وارد حساب شوید"><Empty text="برای انتخاب آدرس، محاسبه ارسال و ثبت سفارش باید وارد حساب کاربری شوید." href="/login?returnTo=/checkout" label="ورود به حساب"/></Shell>; }
  const params = await searchParams;
  const retryOrderId = Number(params?.orderId);
  if (Number.isSafeInteger(retryOrderId) && retryOrderId > 0) {
    const order = await getUserOrder(user.id, retryOrderId);
    if (!order) return <Shell eyebrow="سفارش" title="سفارش پیدا نشد"><Empty text="این سفارش وجود ندارد یا به حساب شما تعلق ندارد." href="/orders" label="مشاهده سفارش‌ها"/></Shell>;
    if (order.status !== 'PENDING' || order.paymentStatus === 'PAID') return <Shell eyebrow="پرداخت" title="این سفارش قابل پرداخت نیست"><Empty text="وضعیت فعلی سفارش اجازه شروع پرداخت جدید را نمی‌دهد." href={`/orders/${order.id}`} label="بازگشت به سفارش"/></Shell>;
    return <Shell eyebrow="پرداخت سفارش" title="ادامه پرداخت"><CheckoutForm addresses={[]} cart={{ items: order.items.map((item) => ({ id: item.id, product_name: item.productName, quantity: item.quantity, line_total: item.lineTotal })), subtotal: order.totalAmount }} existingOrderId={order.id}/></Shell>;
  }
  const [addresses, cart] = await Promise.all([getUserAddresses(user.id), getCart(user.id)]);
  if (!cart?.items?.length) return <Shell eyebrow="سبد خرید" title="سبد خرید شما خالی است"><Empty text="برای شروع خرید، ابتدا محصولی به سبد اضافه کنید." href="/products" label="مشاهده محصولات"/></Shell>;
  return <Shell eyebrow="مرحله نهایی" title="تکمیل سفارش"><div className="mb-6 flex items-center gap-2 text-[9px] font-black text-slate-400"><span className="rounded-full bg-[var(--brand)] px-3 py-1.5 text-white">۱ آدرس</span><span>→</span><span>۲ ارسال</span><span>→</span><span>۳ پرداخت</span></div><CheckoutForm addresses={addresses} cart={cart}/></Shell>;
}
function Empty({ text, href, label }) { return <div className="mx-auto max-w-lg rounded-[28px] border border-[var(--border)] bg-white px-6 py-14 text-center shadow-[0_18px_55px_rgba(23,23,23,.045)]"><p className="text-[12px] leading-7 text-slate-500">{text}</p><Link href={href} className="mt-6 inline-flex rounded-[12px] bg-slate-950 px-6 py-3 text-[11px] font-black text-white hover:bg-[var(--brand)]">{label}</Link></div>; }
