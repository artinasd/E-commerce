'use client';

import { useState } from 'react';

export default function FavoriteButton({ productId, initialFavorite = false, className = '' }) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [busy, setBusy] = useState(false);

  async function toggle(event) {
    event.preventDefault();
    event.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/favorites/${productId}`, { method: 'POST' });
      if (response.status === 401) {
        window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
        return;
      }
      if (!response.ok) throw new Error('favorite update failed');
      const data = await response.json();
      setIsFavorite(Boolean(data.data?.isFavorite));
    } catch {
      // Keep the previous state on transient failures.
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-label={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
      aria-pressed={isFavorite}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-white text-lg shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 disabled:opacity-60 ${className}`}
    >
      <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
    </button>
  );
}
