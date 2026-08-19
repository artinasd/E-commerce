'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FavoriteButton({ productId, initialFavorite = false, className = '' }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/favorites/${productId}`)
      .then(async (response) => {
        if (response.status === 401) return null;
        const result = await response.json();
        if (!response.ok) throw new Error('favorite state failed');
        return Boolean(result.data?.isFavorite);
      })
      .then((value) => { if (!cancelled && value !== null) setIsFavorite(value); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [productId]);

  async function toggle(event) {
    event.preventDefault(); event.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/favorites/${productId}`, { method: 'POST' });
      if (response.status === 401) { router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`); return; }
      if (!response.ok) throw new Error('favorite update failed');
      const data = await response.json();
      setIsFavorite(Boolean(data.data?.isFavorite));
    } catch {
      // Preserve current state on transient failures.
    } finally { setBusy(false); }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-label={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
      aria-pressed={isFavorite}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-[13px] border bg-white/95 shadow-[0_5px_18px_rgba(23,23,23,.10)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(23,23,23,.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 disabled:opacity-60 ${isFavorite ? 'border-[var(--brand)]' : 'border-slate-200'} ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-[21px] w-[21px] transition ${isFavorite ? 'fill-[var(--brand)] stroke-[var(--brand)]' : 'fill-none stroke-slate-500'}`} strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 8.82c0 5.4-8.84 10.08-8.84 10.08S3.16 14.22 3.16 8.82A4.66 4.66 0 0 1 12 6.22a4.66 4.66 0 0 1 8.84 2.6Z" />
      </svg>
    </button>
  );
}
