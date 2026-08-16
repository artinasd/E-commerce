import Link from 'next/link';
import ProductCard from '../../components/storefront/ProductCard';
import { requireUser } from '../../lib/auth/session.js';
import { getUserFavorites } from '../../server/favorites/service.js';

export const metadata = { title: 'علاقه‌مندی‌ها' };

export default async function FavoritesPage() {
  const user = await requireUser();
  const favorites = await getUserFavorites(user.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-bold text-[var(--brand)]">حساب کاربری</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight">علاقه‌مندی‌ها</h1>
        <p className="mt-2 text-sm text-slate-500">محصولاتی که برای بررسی یا خرید بعدی ذخیره کرده‌اید.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-[var(--border)] bg-white px-6 py-20 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-2xl text-slate-400">♡</div>
          <h2 className="mt-5 text-lg font-black">هنوز محصولی ذخیره نکرده‌اید</h2>
          <p className="mt-2 text-sm text-slate-500">روی قلب کنار محصولات بزنید تا بعداً سریع به آن‌ها برگردید.</p>
          <Link href="/products" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">مشاهده محصولات</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {favorites.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
