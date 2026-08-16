'use client';

import { useState } from 'react';
import AddressEditForm from './AddressEditForm.js';

export default function AddressCard({ address, onDeleted }) {
  const [busy,setBusy]=useState(false); const [editing,setEditing]=useState(false); const [defaulting,setDefaulting]=useState(false);
  async function remove(){if(busy||!window.confirm('این آدرس حذف شود؟'))return;setBusy(true);try{const r=await fetch(`/api/account/addresses/${address.id}`,{method:'DELETE'});if(!r.ok)throw new Error();onDeleted?.(address.id)}catch{window.alert('حذف آدرس انجام نشد.')}finally{setBusy(false)}}
  async function makeDefault(){if(address.is_default||defaulting)return;setDefaulting(true);try{const r=await fetch(`/api/account/addresses/${address.id}/default`,{method:'POST'});if(!r.ok)throw new Error();window.location.reload()}catch{window.alert('تغییر آدرس پیش‌فرض انجام نشد.')}finally{setDefaulting(false)}}
  if(editing)return <AddressEditForm address={address} onSaved={()=>window.location.reload()} onCancel={()=>setEditing(false)}/>;
  return <article className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="font-black">{address.recipient_name}</h2><p className="mt-2 text-sm text-slate-600">{address.province}، {address.city}</p></div>{address.is_default&&<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">پیش‌فرض</span>}</div><p className="mt-3 text-sm leading-7">{address.address_line}</p><p className="mt-2 text-xs text-slate-400">کد پستی: {address.postal_code||'—'} · {address.recipient_phone}</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={()=>setEditing(true)} className="rounded-xl border px-4 py-2 text-sm font-bold">ویرایش</button>{!address.is_default&&<button type="button" onClick={makeDefault} disabled={defaulting} className="rounded-xl border px-4 py-2 text-sm font-bold">{defaulting?'در حال تغییر...':'انتخاب به‌عنوان پیش‌فرض'}</button>}<button type="button" onClick={remove} disabled={busy} className="rounded-xl border px-4 py-2 text-sm font-bold text-slate-600 hover:border-red-200 hover:text-red-600">{busy?'در حال حذف...':'حذف'}</button></div></article>;
}
