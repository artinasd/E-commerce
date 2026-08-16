'use client';

import { useState } from 'react';

const initial={recipientName:'',recipientPhone:'',province:'',city:'',addressLine:'',postalCode:'',plaque:'',unit:'',isDefault:false};

export default function AddressForm({ onCreated }) {
  const [form,setForm]=useState(initial); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
  const set=(key,value)=>setForm(v=>({...v,[key]:value}));
  async function submit(e){e.preventDefault();setBusy(true);setError('');try{const r=await fetch('/api/account/addresses',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});const d=await r.json();if(!r.ok)throw new Error(d.error||'ذخیره آدرس انجام نشد.');onCreated?.(d.addressId);setForm(initial);}catch(e){setError(e.message||'ذخیره آدرس انجام نشد.')}finally{setBusy(false)}}
  return <form dir="rtl" onSubmit={submit} className="rounded-2xl border bg-white p-5 shadow-sm"><h2 className="text-xl font-black">افزودن آدرس جدید</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{[['recipientName','نام گیرنده'],['recipientPhone','شماره تلفن'],['province','استان'],['city','شهر'],['postalCode','کد پستی'],['plaque','پلاک'],['unit','واحد']].map(([k,l])=><label key={k} className="text-sm font-bold">{l}<input value={form[k]} onChange={e=>set(k,e.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2" /></label>)}<label className="text-sm font-bold sm:col-span-2">آدرس کامل<textarea required value={form.addressLine} onChange={e=>set('addressLine',e.target.value)} rows={3} className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2" /></label></div><label className="mt-4 flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.isDefault} onChange={e=>set('isDefault',e.target.checked)} /> این آدرس به‌عنوان آدرس پیش‌فرض انتخاب شود</label>{error&&<p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}<button disabled={busy} className="mt-5 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-60">{busy?'در حال ذخیره...':'ذخیره آدرس'}</button></form>}
