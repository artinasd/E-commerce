'use client';

import { useState } from 'react';

export default function ProductGallery({ productName, images }) {
  const items = Array.isArray(images) ? images : [];
  const [selected, setSelected] = useState(0);
  const active = items[selected] || items[0];
  if (!active) return <div className="flex aspect-square items-center justify-center bg-slate-50 text-sm text-slate-400">بدون تصویر</div>;
  return <div><div className="aspect-square overflow-hidden bg-slate-50"><img src={active.url} alt={active.alt_text || productName} className="h-full w-full object-contain p-8 sm:p-14" /></div>{items.length>1&&<div className="grid grid-cols-5 gap-2 border-t border-[var(--border)] p-3">{items.slice(0,10).map((image,index)=><button key={image.id} type="button" onClick={()=>setSelected(index)} aria-label={`تصویر ${index+1}`} className={`aspect-square overflow-hidden rounded-xl bg-slate-50 transition ${index===selected?'ring-2 ring-[var(--brand)] ring-offset-1':'hover:ring-1 hover:ring-slate-300'}`}><img src={image.url} alt={image.alt_text || productName} className="h-full w-full object-contain" /></button>)}</div>}</div>;
}
