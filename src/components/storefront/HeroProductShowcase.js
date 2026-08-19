'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeroProductShowcase({ products = [] }) {
  const items = products.filter((product) => product.primary_image_url || product.image_url).slice(0, 6);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return undefined;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % items.length), 4200);
    return () => window.clearInterval(timer);
  }, [items.length]);

  if (!items.length) {
    return <div className="grid h-full place-items-center text-sm font-black text-slate-400">محصولات تازه به‌زودی</div>;
  }

  const getProduct = (offset) => items[(active + offset + items.length) % items.length];
  const positions = [
    'left-[8%] top-[28%] -rotate-[10deg] scale-[.72] opacity-55 sm:left-[9%] sm:scale-[.78]',
    'left-[19%] top-[10%] -rotate-[5deg] scale-[.84] opacity-80 sm:left-[21%]',
    'left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 scale-100',
    'right-[18%] top-[12%] rotate-[6deg] scale-[.82] opacity-75 sm:right-[20%]',
    'right-[7%] top-[31%] rotate-[11deg] scale-[.7] opacity-50 sm:right-[8%] sm:scale-[.76]',
  ];

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#e8e3d8]" aria-label="ویترین محصولات منتخب">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_47%,rgba(255,255,255,.98),transparent_52%)]" />
      <div className="absolute left-1/2 top-1/2 h-[70%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 blur-3xl" />
      {[-2, -1, 0, 1, 2].map((offset, index) => {
        const product = getProduct(offset);
        const image = product.primary_image_url || product.image_url;
        const isMain = offset === 0;
        return (
          <div key={`${product.id}-${offset}`} className={`absolute transition-[left,right,top,transform,opacity] duration-1000 ease-[cubic-bezier(.22,.61,.36,1)] ${positions[index]}`}>
            <Link href={`/products/${product.slug}`} tabIndex={isMain ? 0 : -1} aria-hidden={!isMain} className={`relative block ${isMain ? 'h-[235px] w-[210px] sm:h-[310px] sm:w-[285px] lg:h-[330px] lg:w-[300px]' : 'h-[170px] w-[145px] sm:h-[210px] sm:w-[180px]'}`}>
              <div className={`absolute inset-0 bg-white shadow-[0_25px_55px_rgba(55,48,38,.16)] ${isMain ? 'border border-white/80' : 'border border-white/60'}`} />
              <div className="absolute inset-2 overflow-hidden bg-white sm:inset-3">
                <Image src={image} alt={isMain ? product.name : ''} fill sizes={isMain ? '(max-width: 640px) 210px, 300px' : '180px'} className="object-contain p-4 sm:p-6" priority={isMain} />
              </div>
              {isMain && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950 px-4 py-2 text-[10px] font-black text-white shadow-lg">مشاهده محصول</div>}
            </Link>
          </div>
        );
      })}
      {items.length > 1 && <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/80 px-2.5 py-2 backdrop-blur-sm">{items.map((product, index) => <button key={product.id} type="button" onClick={() => setActive(index)} aria-label={`نمایش ${product.name}`} className={`h-1.5 rounded-full transition-all ${index === active ? 'w-5 bg-slate-900' : 'w-1.5 bg-slate-300 hover:bg-slate-500'}`} />)}</div>}
    </div>
  );
}
