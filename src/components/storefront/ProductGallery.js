'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProductGallery({ productName, images }) {
  const items = Array.isArray(images) ? images : [];
  const [selected, setSelected] = useState(0);
  const active = items[selected] || items[0];

  if (!active) {
    return <div className="flex min-h-[420px] items-center justify-center bg-[#f6f6f3] text-sm text-slate-400 sm:min-h-[520px]">بدون تصویر</div>;
  }

  return (
    <div className="bg-white">
      <div className="relative flex min-h-[400px] items-center justify-center overflow-hidden bg-[#f3f2ee] sm:min-h-[500px] lg:min-h-[570px]">
        <div className="pointer-events-none absolute inset-6 border border-black/[.045] sm:inset-8" />
        <Image
          src={active.url}
          alt={active.alt_text || productName}
          width={1000}
          height={1000}
          sizes="(max-width: 1024px) 100vw, 52vw"
          unoptimized
          className="relative z-10 h-full max-h-[520px] w-full object-contain px-5 py-7 transition duration-300 sm:max-h-[550px] sm:px-10 sm:py-9"
          priority
        />
        {items.length > 1 && <span className="absolute bottom-4 left-4 z-20 bg-white/90 px-2.5 py-1 text-[9px] font-black text-slate-500 shadow-sm">{(selected + 1).toLocaleString('fa-IR')} / {items.length.toLocaleString('fa-IR')}</span>}
      </div>
      {items.length > 1 && (
        <div className="border-t border-[var(--border)] px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex flex-wrap gap-3">
            {items.slice(0, 10).map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`تصویر ${index + 1}`}
                aria-pressed={index === selected}
                className={`relative h-20 w-20 shrink-0 overflow-hidden border bg-[#f8f8f6] transition sm:h-24 sm:w-24 ${index === selected ? 'border-[var(--brand)] ring-1 ring-[var(--brand)]' : 'border-[var(--border)] hover:border-slate-400'}`}
              >
                <Image src={image.url} alt={image.alt_text || productName} fill sizes="96px" unoptimized className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
