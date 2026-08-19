'use client';
import { useState } from 'react';

function getErrorMessage(value, fallback = 'خطا در ذخیره اطلاعات.') {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    if (typeof value.message === 'string') return value.message;
    if (typeof value.error?.message === 'string') return value.error.message;
  }
  return fallback;
}

export default function ProfileForm({ profile }) {
  const [form, setForm] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    phone: profile?.phone || '',
  });
  const [state, setState] = useState('');

  async function submit(e) {
    e.preventDefault();
    setState('در حال ذخیره…');
    try {
      const r = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      setState(r.ok ? 'ذخیره شد.' : getErrorMessage(d?.error));
    } catch (error) {
      setState(getErrorMessage(error));
    }
  }

  return <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
    <label className="text-sm font-bold">نام<input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="mt-2 w-full rounded-xl border px-4 py-3" /></label>
    <label className="text-sm font-bold">نام خانوادگی<input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="mt-2 w-full rounded-xl border px-4 py-3" /></label>
    <label className="text-sm font-bold">شماره تلفن<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} dir="ltr" className="mt-2 w-full rounded-xl border px-4 py-3" /></label>
    <div className="flex items-end gap-3"><button className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white">ذخیره</button><span className="text-sm text-slate-500">{state}</span></div>
  </form>;
}
