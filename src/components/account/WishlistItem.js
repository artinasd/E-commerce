'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function WishlistItem({ product }) {
  const [removed, setRemoved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (busy) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/favorites/${product.product_id}`, { method: 'POST' });
      if (!response.ok) throw new Error('Unable to update favorite');
      const data = await response.json();
      if (!data.data?.isFavorite) setRemoved(true);
    } catch {
      // Keep the item visible if the request fails.
    } finally {
      setBusy(false);
    }
  }

  if (removed) return null;

  return (
    <article className="group rounded-2xl border bg-white p-3 shadow-sm">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-50">
          {product.thumbnail_url && (
            <Image src={product.thumbnail_url} alt={product.name} fill className="object-contain transition-transform group-hover:scale-105" />
          )}
        </div>
        <h2 className="mt-3 line-clamp-2 font-bold">{product.name}</h2>
        <p className="mt-2 font-black">{Number(product.price || 0).toLocaleString('fa-IR')} تومان</p>
      </Link>
      <button type="button" onClick={remove} disabled={busy} className="mt-3 w-full rounded-xl border px-3 py-2 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:text-red-600 disabled:opacity-60">
        {busy ? 'در حال حذف...' : 'حذف از علاقه‌مندی‌ها'}
      </button>
    </article>
  );
}
