'use client';

import { useState } from 'react';
import AddressEditForm from './AddressEditForm.js';

export default function AddressCard({ address, onDeleted }) {
  const [busy, setBusy] = useState(false); const [editing, setEditing] = useState(false); const [defaulting, setDefaulting] = useState(false);
  async function remove() { if (busy || !window.confirm('این آدرس حذف شود؟')) return; setBusy(true); try { const r = await fetch(`/api/account/addresses/${address.id}`, { method: 'DELETE' }); if (!r.ok) throw new Error(); onDeleted?.(address.id); window.location.reload(); } catch { window.alert('حذف آدرس انجام نشد.'); } finally { setBusy(false); } }
  async function makeDefault() { if (address.is_default || defaulting) return; setDefaulting(true); try { const r = await fetch(`/api/account/addresses/${address.id}/default`, { method: 'POST' }); if (!r.ok) throw new Error(); window.location.reload(); } catch { window.alert('تغییر آدرس پیش‌فرض انجام نشد.'); } finally { setDefaulting(false); } }
  if (editing) return <AddressEditForm address={address} onSaved={() => window.location.reload()} onCancel={() => setEditing(false)} />;
  return <article className={`group border bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(23,23,23,.06)] ${address.is_default ? 'border-[var(--brand)]/30' : 'border-[var(--border)]'}`}>
    <div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="flex items-center gap-2"><span className="grid h-8 w-8 shrink-0 place-items-center bg-[#fafaf8] text-xs text-slate-400">⌖</span><div><h2 className="text-[12px] font-black">{address.recipient_name}</h2><p className="mt-1 text-[9px] font-bold text-slate-400">{address.province}، {address.city}</p></div></div></div>{address.is_default && <span className="shrink-0 bg-[#fff3f3] px-3 py-1.5 text-[8px] font-black text-[var(--brand)]">آدرس پیش‌فرض</span>}</div>
    <div className="mt-5 border-t border-[var(--border)] pt-4"><p className="text-[10px] leading-6 text-slate-600">{address.address_line}</p><p className="mt-3 text-[8px] font-bold text-slate-400">کد پستی <span className="font-mono">{address.postal_code || '—'}</span><span className="mx-2 text-slate-200">|</span>{address.recipient_phone}</p></div>
    <div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => setEditing(true)} className="border border-[var(--border)] px-4 py-2 text-[9px] font-black transition hover:border-slate-300 hover:bg-slate-50">ویرایش</button>{!address.is_default && <button type="button" onClick={makeDefault} disabled={defaulting} className="border border-[var(--border)] px-4 py-2 text-[9px] font-black text-slate-600 transition hover:border-[var(--brand)]/30 hover:text-[var(--brand)] disabled:opacity-50">{defaulting ? 'در حال تغییر...' : 'انتخاب به‌عنوان پیش‌فرض'}</button>}<button type="button" onClick={remove} disabled={busy} className="border border-transparent px-4 py-2 text-[9px] font-black text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">{busy ? 'در حال حذف...' : 'حذف'}</button></div>
  </article>;
}
