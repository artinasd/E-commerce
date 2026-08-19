const variants = product.variants || [];
  const cheapest = variants.filter((v) => Number(v.available_quantity) > 0).sort((a, b) => Number(a.price) - Number(b.price))[0] || variants[0];
  const averageRating = Number(reviewData.averageRating || product.average_rating || 0);
  const reviewCount = Number(reviewData.reviewCount || product.review_count || 0);
  const hasDiscount = cheapest && Number(cheapest.compare_at_price || 0) > Number(cheapest.price || 0);
  const discountPercent = hasDiscount ? Math.round((1 - Number(cheapest.price) / Number(cheapest.compare_at_price)) * 100) : 0;

  return <div className="store-shell py-6 sm:py-9">
    <nav className="mb-6 flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-400" aria-label="مسیر صفحه"><Link href="/products" className="hover:text-[var(--brand)]">محصولات</Link><span>/</span>{product.category_name && <><span>{product.category_name}</span><span>/</span></>}<span className="truncate text-slate-600">{product.name}</span></nav>
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
      <section className="self-start overflow-hidden rounded-[28px] border border-[var(--border)] bg-white shadow-[0_18px_55px_rgba(23,23,23,.045)]"><ProductGallery productName={product.name} images={images}/></section>
      <section className="self-start lg:sticky lg:top-24">
        <div className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_55px_rgba(23,23,23,.045)] sm:p-7">
          <div className="flex items-start justify-between gap-5"><div className="min-w-0"><p className="text-[10px] font-black tracking-wide text-[var(--brand)]">{product.brand_name || 'فروشگاه ایرانیان'}</p><h1 className="mt-2 text-2xl font-black leading-[1.8] tracking-tight text-slate-950 sm:text-[30px]">{product.name}</h1></div><FavoriteButton productId={product.id} className="shrink-0"/></div>
          {product.short_description && <p className="mt-4 text-[14px] leading-8 text-slate-500">{product.short_description}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px]"><span className="font-black text-amber-500"><Stars value={averageRating}/></span><span className="font-black text-slate-800">{ratingText(averageRating)}</span><a href="#reviews" className="text-slate-400 hover:text-[var(--brand)]">{reviewCount.toLocaleString('fa-IR')} دیدگاه</a><span className="h-1 w-1 rounded-full bg-slate-300"/><span className="text-emerald-600">خرید مطمئن</span></div>