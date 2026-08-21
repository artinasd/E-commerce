'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProductGallery({ productName, images }) {
  const items = Array.isArray(images) ? images : [];
  const [selected, setSelected] = useState(0);
  const active = items[selected] || items[0];

  if (!active) return <div className="flex min-h-[420px] items-center justify-center bg-[#f7f7f4] text-sm text-slate-400 sm:min-h-[520px]">بدون تصویر</div>;

  return <div className="bg-white">
    <div className="relative flex min-h-[400px] items-center justify-center overflow-hidden bg-[#f7f7f4] sm:min-h-[500px] lg:min-h-[570px]">
      <div className="pointer-events-none absolute inset-5 rounded-[20px] border border-black/[.045] sm:inset-7" />
      <Image src={active.url} alt={active.alt_text || productName} width={1000} height={1000} sizes="(max-width: 1024px) 100vw, 52vw" unoptimized className="relative z-10 h-full max-h-[520px] w-full object-contain px-5 py-7 transition duration-500 sm:max-h-[550px] sm:px-10 sm:py-9" priority />
      {items.length > 1 && <div className="absolute bottom-4 left-4 z-20 rounded-full border border-black/[.05] bg-white/90 px-3 py-1.5 text-[8px] font-black text-slate-500 shadow-sm backdrop-blur">{(selected + 1).toLocaleString('fa-IR')} / {items.length.toLocaleString('fa-IR')}</div>}
    </div>
    {items.length > 1 && <div className="border-t border-[var(--border)] px-3 py-3 sm:px-4 sm:py-4"><div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
      {items.slice(0, 10).map((image, index) => <button key={image.id} type="button" onClick={() => setSelected(index)} aria-label={`تصویر ${index + 1}`} aria-pressed={index === selected} className={`group relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-[10px] border bg-[#fafaf8] transition sm:h-20 sm:w-20 ${index === selected ? 'border-[var(--brand)] ring-2 ring-[var(--brand)]/15' : 'border-[var(--border)] hover:border-slate-400'}`}><Image src={image.url} alt={image.alt_text || productName} fill sizes="80px" unoptimized className="object-cover transition duration-300 group-hover:scale-105"/></button>)}
    </div></div>}
  </div>;
}
