'use client';

import { useState } from 'react';

export default function AddressCard({ address, onDeleted }) {
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (busy || !window.confirm('این آدرس حذف شود؟')) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/account/addresses/${address.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('delete failed');
      onDeleted(address.id);
    } catch {
      window.alert('حذف آدرس انجام نشد. دوباره تلاش کنید.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-black">{address.recipient_name}</h2>
          <p className="mt-2 text-sm text-slate-600">{address.province}، {address.city}</p>
        </div>
        {address.is_default && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">پیش‌فرض</span>}
      </div>
      <p className="mt-3 text-sm leading-7">{address.address_line}</p>
      <p className="mt-2 text-xs text-slate-400">کد پستی: {address.postal_code || '—'} · {address.recipient_phone}</p>
      <button type="button" onClick={remove} disabled={busy} className="mt-4 rounded-xl border px-4 py-2 text-sm font-bold text-slate-600 hover:border-red-200 hover:text-red-600 disabled:opacity-60">
        {busy ? 'در حال حذف...' : 'حذف آدرس'}
      </button>
    </article>
  );
}
