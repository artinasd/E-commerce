import Link from 'next/link';
import CheckoutForm from '../../components/storefront/CheckoutForm';
import { requireUser } from '../../lib/auth/session.js';
import { getUserAddresses } from '../../server/address/service.js';
import { getCart } from '../../server/cart/service.js';

export const metadata = { title: 'تکمیل سفارش' };

export default async function CheckoutPage() {
  let user;
  try { user = await requireUser(); } catch { return <div className="mx-auto max-w-2xl px-4 py-24 text-center"><h1 className="text-2xl font-black">برای ادامه وارد حساب شوید</h1><p className="mt-2 text-sm text-slate-500">برای انتخاب آدرس و ثبت سفارش باید وارد حساب کاربری خود شوید.</p><Link href="/login?returnTo=/checkout" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">ورود به حساب</Link></div>; }
  const [addresses, cart] = await Promise.all([getUserAddresses(user.id), getCart(user.id)]);
  if (!cart?.items?.length) return <div className="mx-auto max-w-2xl px-4 py-24 text-center"><h1 className="text-2xl font-black">سبد خرید شما خالی است</h1><p className="mt-2 text-sm text-slate-500">برای شروع خرید، ابتدا محصولی به سبد اضافه کنید.</p><Link href="/products" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">مشاهده محصولات</Link></div>;
  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><div className="mb-7"><p className="text-xs font-bold text-[var(--brand)]">مرحله نهایی</p><h1 className="mt-1 text-2xl font-black">تکمیل سفارش</h1><p className="mt-2 text-sm text-slate-500">آدرس ارسال را انتخاب کنید و سفارش خود را ثبت کنید.</p></div><CheckoutForm addresses={addresses} cart={cart} /></div>;
}
