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
      .catch(() => {})
      .finally(() => {});
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

  return <button type="button" onClick={toggle} disabled={busy} aria-label={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'} aria-pressed={isFavorite} className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white text-lg shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 disabled:opacity-60 ${className}`}><span aria-hidden="true" className={isFavorite ? 'text-[var(--brand)]' : 'text-slate-400'}>{isFavorite ? '♥' : '♡'}</span></button>;
}
