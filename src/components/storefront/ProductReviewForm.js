'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductReviewForm({ slug }) {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [state, setState] = useState('loading');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/products/${encodeURIComponent(slug)}/reviews/eligible`)
      .then(async (response) => {
        if (response.status === 401) return { unauthenticated: true };
        const result = await response.json();
        if (!response.ok) throw new Error(result?.error?.message || 'خطا در دریافت اطلاعات ثبت دیدگاه');
        return result.data || {};
      })
      .then((result) => {
        if (cancelled) return;
        if (result.unauthenticated) { setState('guest'); return; }
        const nextItems = Array.isArray(result.items) ? result.items : [];
        setItems(nextItems);
        setSelectedItem(nextItems[0]?.id ? String(nextItems[0].id) : '');
        setState(nextItems.length ? 'ready' : 'empty');
      })
      .catch((error) => { if (!cancelled) { setMessage(error.message); setState('error'); } });
    return () => { cancelled = true; };
  }, [slug]);

  async function submit(event) {
    event.preventDefault();
    if (!selectedItem) return;
    setBusy(true); setMessage('');
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(slug)}/reviews`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderItemId: Number(selectedItem), rating, title, content }),
      });
      const result = await response.json();
      if (response.status === 401) { router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`); return; }
      if (!response.ok) throw new Error(result?.error?.message || 'ثبت دیدگاه انجام نشد.');
      setMessage('دیدگاه شما ثبت شد و پس از بررسی مدیر نمایش داده می‌شود.');
      setItems((current) => current.filter((item) => String(item.id) !== String(selectedItem)));
      setSelectedItem(''); setTitle(''); setContent(''); setState('empty');
    } catch (error) { setMessage(error.message); } finally { setBusy(false); }
  }

  if (state === 'loading') return <div className="rounded-2xl border border-[var(--border)] bg-white p-5 text-sm text-slate-400">در حال بررسی امکان ثبت دیدگاه…</div>;
  if (state === 'guest') return <div className="rounded-2xl border border-[var(--border)] bg-white p-5"><p className="font-bold">تجربه خریدتان را ثبت کنید</p><p className="mt-2 text-sm text-slate-500">برای ثبت امتیاز و دیدگاه ابتدا وارد حساب کاربری شوید.</p><button type="button" onClick={() => router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`)} className="mt-4 rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-bold text-white">ورود به حساب</button></div>;
  if (state === 'empty') return <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-5 text-sm leading-7 text-slate-500">برای ثبت دیدگاه، باید این محصول را خریداری کرده و سفارش شما تحویل شده باشد. هر خرید نیز فقط یک‌بار قابل ارزیابی است.</div>;
  if (state === 'error') return <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">{message}</div>;

  return <form onSubmit={submit} className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6">
    <div><p className="text-xs font-bold text-[var(--brand)]">ثبت تجربه خرید</p><h3 className="mt-1 text-xl font-black">امتیاز و دیدگاه شما</h3></div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-sm font-bold">سفارش خریداری‌شده<select required value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 font-normal">{items.map((item) => <option key={item.id} value={item.id}>سفارش #{item.order_id} — {item.sku}</option>)}</select></label>
      <div><p className="text-sm font-bold">امتیاز</p><div className="mt-2 flex gap-1" dir="ltr">{[1,2,3,4,5].map((value) => <button key={value} type="button" aria-label={`${value} از ۵`} onClick={() => setRating(value)} className={`text-3xl transition ${value <= rating ? 'text-amber-500' : 'text-slate-200'} hover:scale-110`}>★</button>)}</div></div>
    </div>
    <label className="mt-4 grid gap-2 text-sm font-bold">عنوان<input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} className="rounded-xl border border-slate-200 px-4 py-3 font-normal" placeholder="مثلاً کیفیت ساخت عالی بود" /></label>
    <label className="mt-4 grid gap-2 text-sm font-bold">متن دیدگاه<textarea required={!title} value={content} onChange={(e) => setContent(e.target.value)} maxLength={5000} rows={5} className="rounded-xl border border-slate-200 px-4 py-3 font-normal" placeholder="تجربه‌تان از محصول را بنویسید…" /></label>
    {message && <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
    <button disabled={busy} className="mt-5 rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-black text-white disabled:opacity-50">{busy ? 'در حال ثبت…' : 'ثبت دیدگاه'}</button>
  </form>;
}
