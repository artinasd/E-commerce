import Link from 'next/link';
import CartClient from '../../components/storefront/CartClient';
import { requireUser } from '../../lib/auth/session.js';
import { getCart } from '../../server/cart/service.js';

export const metadata = { title: 'سبد خرید' };

export default async function CartPage() {
  let cart;
  try {
    const user = await requireUser();
    cart = await getCart(user.id);
  } catch (error) {
    if (error?.code === 'UNAUTHORIZED') {
      return <div className="mx-auto max-w-2xl px-4 py-24 text-center"><h1 className="text-2xl font-black">برای مشاهده سبد خرید وارد شوید</h1><p className="mt-2 text-sm text-slate-500">سبد خرید به حساب کاربری شما متصل است.</p><Link href="/login?returnTo=/cart" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">ورود به حساب</Link></div>;
    }
    throw error;
  }

  return <CartClient initialCart={cart} />;
}
