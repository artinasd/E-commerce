'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProductGallery({ productName, images }) {
  const items = Array.isArray(images) ? images : [];
  const [selected, setSelected] = useState(0);
  const active = items[selected] || items[0];

  if (!active) {
    return (
      <div className="flex aspect-square items-center justify-center bg-slate-50 text-sm text-slate-400">
        بدون تصویر
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden bg-[#f6f6f3]">
        <Image
          src={active.url}
          alt={active.alt_text || productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          unoptimized
          className="object-contain p-8 sm:p-14"
          priority
        />
      </div>
      {items.length > 1 && (
        <div className="grid grid-cols-5 gap-2 border-t border-[var(--border)] bg-white p-3 sm:grid-cols-6">
          {items.slice(0, 10).map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`تصویر ${index + 1}`}
              aria-pressed={index === selected}
              className={`relative aspect-square overflow-hidden border bg-[#f8f8f6] transition ${
                index === selected
                  ? 'border-[var(--brand)] ring-1 ring-[var(--brand)]'
                  : 'border-transparent hover:border-slate-300'
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt_text || productName}
                fill
                sizes="20vw"
                unoptimized
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
