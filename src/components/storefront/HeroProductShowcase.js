'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeroProductShowcase({ products = [] }) {
  const items = products.filter((product) => product.primary_image_url || product.image_url).slice(0, 6);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return undefined;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % items.length), 4500);
    return () => window.clearInterval(timer);
  }, [items.length]);

  if (!items.length) return <div className="grid h-full place-items-center text-sm font-black text-slate-400">محصولات تازه به‌زودی</div>;

  const getProduct = (offset) => items[(active + offset + items.length) % items.length];
  const positions = [
    'left-[3%] top-[30%] -rotate-[13deg] scale-[.62] opacity-35 blur-[.2px] sm:left-[7%] sm:scale-[.68]',
    'left-[15%] top-[8%] -rotate-[6deg] scale-[.78] opacity-65 sm:left-[18%] sm:scale-[.82]',
    'left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 scale-100',
    'right-[15%] top-[8%] rotate-[6deg] scale-[.78] opacity-65 sm:right-[18%] sm:scale-[.82]',
    'right-[3%] top-[30%] rotate-[13deg] scale-[.62] opacity-35 blur-[.2px] sm:right-[7%] sm:scale-[.68]',
  ];

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#e7e1d5]" aria-label="ویترین محصولات منتخب">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_43%,rgba(255,255,255,.98)_0%,rgba(255,255,255,.7)_25%,transparent_62%)]" />
      <div className="absolute left-1/2 top-[53%] h-[42%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[#b8aa91]/25 blur-3xl" />
      <div className="absolute left-1/2 top-[17%] h-20 w-20 -translate-x-1/2 rounded-full bg-white/45 blur-2xl" />
      {[-2, -1, 0, 1, 2].map((offset, index) => {
        const product = getProduct(offset);
        const image = product.primary_image_url || product.image_url;
        const isMain = offset === 0;
        return (
          <div key={`${product.id}-${offset}`} className={`absolute transition-[left,right,top,transform,opacity,filter] duration-[1200ms] ease-[cubic-bezier(.22,.61,.36,1)] ${positions[index]}`}>
            <Link href={`/products/${product.slug}`} tabIndex={isMain ? 0 : -1} aria-hidden={!isMain} className={`relative block ${isMain ? 'h-[245px] w-[220px] sm:h-[315px] sm:w-[290px] lg:h-[350px] lg:w-[320px]' : 'h-[155px] w-[130px] sm:h-[205px] sm:w-[175px]'}`}>
              <div className={`absolute -bottom-5 left-1/2 h-8 -translate-x-1/2 rounded-[50%] bg-slate-900/15 blur-xl transition-all duration-1000 ${isMain ? 'w-[72%]' : 'w-[58%]'}`} />
              <div className={`absolute inset-0 overflow-hidden bg-white shadow-[0_28px_65px_rgba(47,40,29,.18)] ${isMain ? 'border border-white' : 'border border-white/75'}`}>
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,.95),rgba(247,245,240,.9))]" />
                <div className="absolute inset-2 overflow-hidden bg-white sm:inset-3">
                  <Image src={image} alt={isMain ? product.name : ''} fill sizes={isMain ? '(max-width: 640px) 220px, 320px' : '175px'} className="object-contain p-4 sm:p-6" priority={isMain} />
                </div>
              </div>
              {isMain && <div className="absolute -bottom-3 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap bg-slate-950 px-5 py-2.5 text-[10px] font-black text-white shadow-xl">مشاهده محصول</div>}
            </Link>
          </div>
        );
      })}
      {items.length > 1 && <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 border border-white/80 bg-white/75 px-3 py-2 backdrop-blur-md">{items.map((product, index) => <button key={product.id} type="button" onClick={() => setActive(index)} aria-label={`نمایش ${product.name}`} className={`h-1.5 transition-all duration-300 ${index === active ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-300 hover:bg-slate-500'}`} />)}</div>}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#e7e1d5]/55 to-transparent" />
    </div>
  );
}
