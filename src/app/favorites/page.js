import { redirect } from 'next/navigation';

export const metadata = { title: 'علاقه‌مندی‌ها' };

export default function FavoritesPage() {
  redirect('/account/wishlist');
}
