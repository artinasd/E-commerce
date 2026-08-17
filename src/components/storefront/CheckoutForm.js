'use client';

import { useEffect, useMemo, useState } from 'react';

const money = (value) => new Intl.NumberFormat('fa-IR').format(Number(value || 0));

export default function CheckoutForm({ addresses, cart, existingOrderId = null }) {
  const [selectedAddress, setSelectedAddress] = useState(addresses.find((address) => address.is_default)?.id || addresses[0]?.id || '');
  const [newAddress, setNewAddress] = useState(false);
  const [form, setForm] = useState({ recipientName: '', recipientPhone: '', province: '', city: '', postalCode: '', addressLine: '', plaque: '', unit: '' });
  const [shippingMethods, setShippingMethods] = useState([]);
  const [shippingStatus, setShippingStatus] = useState('idle');
  const [shippingMessage, setShippingMessage] = useState('');
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponStatus, setCouponStatus] = useState('idle');
  const [couponMessage, setCouponMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const subtotal = Number(cart?.subtotal || 0);
  const itemCount = (cart?.items || []).reduce((sum, item) => sum + Number(item.quantity), 0);
  const displayedDiscount = Number(appliedCoupon?.discountAmount || 0);
  const selectedExistingAddress = addresses.find((address) => String(address.id) === String(selectedAddress));
  const province = newAddress ? form.province.trim() : (selectedExistingAddress?.province || '').trim();
  const selectedShipping = useMemo(() => shippingMethods.find((method) => String(method.id) === String(selectedShippingMethod)) || null, [shippingMethods, selectedShippingMethod]);
  const shippingAmount = selectedShipping ? (selectedShipping.free_shipping_minimum != null && subtotal >= Number(selectedShipping.free_shipping_minimum) ? 0 : Number(selectedShipping.base_amount || 0)) : 0;
  const displayedTotal = Math.max(0, subtotal - displayedDiscount + shippingAmount);

  function resetShippingSelection() {
    setShippingMethods([]);
    setSelectedShippingMethod('');
    setShippingStatus('idle');
    setShippingMessage('');
  }

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    if (event.target.name === 'province') resetShippingSelection();
  }

  useEffect(() => {
    if (existingOrderId || !province) return;
    let cancelled = false;
    async function loadShippingMethods() {
      setShippingStatus('loading');
      setShippingMessage('در حال دریافت روش‌های ارسال...');
      try {
        const response = await fetch(`/api/checkout/shipping?province=${encodeURIComponent(province)}`);
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error?.message || 'روش‌های ارسال دریافت نشد.');
        if (cancelled) return;
        const methods = Array.isArray(payload?.data?.methods) ? payload.data.methods : [];
        setShippingMethods(methods);
        setSelectedShippingMethod(methods[0]?.id || '');
        setShippingStatus(methods.length ? 'success' : 'empty');
        setShippingMessage(methods.length ? '' : 'برای این استان روش ارسال فعالی پیدا نشد.');
      } catch (error) {
        if (cancelled) return;
        setShippingMethods([]);
        setSelectedShippingMethod('');
        setShippingStatus('error');
        setShippingMessage(error.message || 'روش‌های ارسال دریافت نشد.');
      }
    }
    loadShippingMethods();
    return () => { cancelled = true; };
  }, [province, existingOrderId]);

  async function applyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (!code || couponStatus === 'loading') return;
    setCouponStatus('loading');
    setCouponMessage('در حال بررسی کد تخفیف...');
    try {
      const response = await fetch('/api/checkout/coupon', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message || 'کد تخفیف معتبر نیست.');
      setAppliedCoupon(payload.data.promotion);
      setCouponCode(payload.data.promotion.code);
      setCouponStatus('success');
      setCouponMessage(`کد ${payload.data.promotion.code} با موفقیت اعمال شد.`);
    } catch (error) {
      setAppliedCoupon(null);
      setCouponStatus('error');
      setCouponMessage(error.message || 'بررسی کد تخفیف انجام نشد.');
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponStatus('idle');
    setCouponMessage('');
  }

  async function placeOrder() {
    if (status === 'loading') return;
    setStatus('loading');
    setMessage(existingOrderId ? 'در حال آماده‌سازی پرداخت...' : 'در حال ثبت سفارش...');
    try {
      let orderId = existingOrderId;
      if (!orderId) {
        let addressId = selectedAddress;
        if (newAddress) {
          const addressResponse = await fetch('/api/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
          const addressPayload = await addressResponse.json();
          if (!addressResponse.ok) throw new Error(addressPayload?.error?.message || 'ثبت آدرس انجام نشد.');
          addressId = addressPayload.data.address.id;
        }
        if (!addressId) throw new Error('لطفاً یک آدرس انتخاب کنید.');
        if (!selectedShippingMethod) throw new Error('لطفاً یک روش ارسال انتخاب کنید.');
        const checkoutResponse = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ addressId, shippingMethodId: Number(selectedShippingMethod), couponCode: appliedCoupon?.code || null }) });
        const checkoutPayload = await checkoutResponse.json();
        if (!checkoutResponse.ok) throw new Error(checkoutPayload?.error?.message || 'ثبت سفارش انجام نشد.');
        orderId = checkoutPayload?.data?.order?.id;
        if (!orderId) throw new Error('شناسه سفارش از سرور دریافت نشد.');
      }
      setMessage('در حال آماده‌سازی پرداخت...');
      const paymentResponse = await fetch('/api/payments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId }) });
      const paymentPayload = await paymentResponse.json();
      if (!paymentResponse.ok) throw new Error(paymentPayload?.error?.message || 'شروع پرداخت انجام نشد.');
      const redirectUrl = paymentPayload?.data?.redirectUrl;
      if (!redirectUrl) throw new Error('مسیر ادامه سفارش از سرور دریافت نشد.');
      window.location.assign(redirectUrl);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'خطایی رخ داد.');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-5">
        {!existingOrderId && <div className="rounded-2xl border border-[var(--border)] bg-white p-5"><div className="flex items-center justify-between gap-3"><h2 className="text-base font-black">آدرس ارسال</h2><button type="button" onClick={() => { setNewAddress((value) => !value); resetShippingSelection(); }} className="text-xs font-bold text-[var(--brand)]">{newAddress ? 'انتخاب آدرس قبلی' : '+ آدرس جدید'}</button></div>{!newAddress && <div className="mt-4 grid gap-3">{addresses.map((address) => <label key={address.id} className={`cursor-pointer rounded-xl border p-4 ${String(selectedAddress) === String(address.id) ? 'border-[var(--brand)] bg-red-50/40' : 'border-[var(--border)]'}`}><span className="flex gap-3"><input type="radio" name="address" checked={String(selectedAddress) === String(address.id)} onChange={() => { setSelectedAddress(address.id); resetShippingSelection(); }} /><span><span className="block text-sm font-bold">{address.recipient_name}</span><span className="mt-1 block text-xs leading-6 text-slate-500">{address.province}، {address.city}، {address.address_line}<br />{address.postal_code} · {address.recipient_phone}</span></span></span></label>)}</div>}{newAddress && <div className="mt-4 grid gap-3 sm:grid-cols-2">{[['recipientName','نام گیرنده'],['recipientPhone','شماره موبایل'],['province','استان'],['city','شهر'],['postalCode','کد پستی'],['plaque','پلاک'],['unit','واحد']].map(([name, label]) => <input key={name} name={name} value={form[name]} onChange={updateField} placeholder={label} className="h-11 rounded-xl border border-[var(--border)] px-3 text-sm outline-none focus:border-[var(--brand)]" />)}<textarea name="addressLine" value={form.addressLine} onChange={updateField} placeholder="نشانی کامل" rows={3} className="rounded-xl border border-[var(--border)] px-3 py-3 text-sm outline-none focus:border-[var(--brand)] sm:col-span-2" /></div>}</div>}
        {!existingOrderId && <div className="rounded-2xl border border-[var(--border)] bg-white p-5"><h2 className="text-base font-black">روش ارسال</h2>{shippingStatus === 'loading' && <p className="mt-4 text-sm text-slate-500">{shippingMessage}</p>}{shippingStatus === 'error' && <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{shippingMessage}</p>}{shippingStatus === 'empty' && <p className="mt-4 text-sm text-slate-500">{shippingMessage}</p>}{shippingMethods.length > 0 && <div className="mt-4 grid gap-3">{shippingMethods.map((method) => { const free = method.free_shipping_minimum != null && subtotal >= Number(method.free_shipping_minimum); const amount = free ? 0 : Number(method.base_amount || 0); return <label key={method.id} className={`cursor-pointer rounded-xl border p-4 ${String(selectedShippingMethod) === String(method.id) ? 'border-[var(--brand)] bg-red-50/40' : 'border-[var(--border)]'}`}><span className="flex items-start gap-3"><input type="radio" name="shippingMethod" checked={String(selectedShippingMethod) === String(method.id)} onChange={() => setSelectedShippingMethod(method.id)} /><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3"><span className="text-sm font-bold">{method.name}</span><span className="shrink-0 text-sm font-black">{amount === 0 ? 'رایگان' : `${money(amount)} تومان`}</span></span>{method.description && <span className="mt-1 block text-xs leading-5 text-slate-500">{method.description}</span>}{method.free_shipping_minimum != null && !free && <span className="mt-1 block text-[11px] text-emerald-700">ارسال رایگان برای خریدهای بالاتر از {money(method.free_shipping_minimum)} تومان</span>}</span></span></label>; })}</div>}</div>}
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5"><h2 className="text-base font-black">کد تخفیف</h2><div className="mt-4 flex gap-2"><input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); applyCoupon(); } }} disabled={Boolean(appliedCoupon) || couponStatus === 'loading'} maxLength={64} placeholder="مثلاً WELCOME20" className="h-11 min-w-0 flex-1 rounded-xl border border-[var(--border)] px-3 text-sm uppercase outline-none focus:border-[var(--brand)] disabled:bg-slate-50" /><button type="button" onClick={appliedCoupon ? removeCoupon : applyCoupon} disabled={couponStatus === 'loading' || (!appliedCoupon && !couponCode.trim())} className="h-11 rounded-xl border border-[var(--border)] px-4 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50">{couponStatus === 'loading' ? 'بررسی...' : appliedCoupon ? 'حذف' : 'اعمال'}</button></div>{couponMessage && <p role={couponStatus === 'error' ? 'alert' : 'status'} className={`mt-3 text-xs font-semibold ${couponStatus === 'error' ? 'text-red-600' : 'text-emerald-700'}`}>{couponMessage}</p>}</div>
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5"><h2 className="text-base font-black">روش پرداخت</h2><div className="mt-4 rounded-xl border border-[var(--brand)] bg-red-50/40 p-4"><p className="text-sm font-bold">پرداخت آنلاین</p><p className="mt-1 text-xs text-slate-500">پس از ثبت سفارش، در صورت فعال بودن درگاه به صفحه پرداخت منتقل می‌شوید؛ در غیر این صورت وضعیت سفارش نمایش داده می‌شود.</p></div></div>
        {status === 'error' && <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{message}</div>}
      </section>
      <aside className="h-fit rounded-2xl border border-[var(--border)] bg-white p-5 lg:sticky lg:top-24"><h2 className="text-base font-black">خلاصه سفارش</h2><div className="mt-5 space-y-3 border-b border-[var(--border)] pb-5 text-sm">{(cart?.items || []).map((item) => <div key={item.id} className="flex justify-between gap-4"><span className="line-clamp-2 text-slate-500">{item.product_name} × {item.quantity}</span><span className="shrink-0 font-semibold">{money(item.line_total)}</span></div>)}</div><div className="mt-5 flex justify-between text-sm"><span className="text-slate-500">جمع کالاها</span><span>{money(subtotal)} تومان</span></div>{displayedDiscount > 0 && <div className="mt-3 flex justify-between text-sm text-emerald-700"><span>تخفیف</span><span>− {money(displayedDiscount)} تومان</span></div>}<div className="mt-3 flex justify-between text-sm"><span className="text-slate-500">ارسال</span><span>{selectedShippingMethod ? (shippingAmount === 0 ? 'رایگان' : `${money(shippingAmount)} تومان`) : 'انتخاب نشده'}</span></div><div className="mt-3 flex justify-between"><span className="text-sm text-slate-500">تعداد کالا</span><span className="text-sm font-bold">{money(itemCount)}</span></div><div className="mt-3 flex justify-between border-t border-[var(--border)] pt-5"><span className="font-bold">مبلغ قابل پرداخت</span><strong className="text-xl">{money(displayedTotal)} <span className="text-xs font-medium text-slate-400">تومان</span></strong></div><button type="button" disabled={status === 'loading' || !cart?.items?.length || (!existingOrderId && !selectedShippingMethod)} onClick={placeOrder} className="mt-6 h-12 w-full rounded-xl bg-[var(--brand)] text-sm font-bold text-white transition hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-50">{status === 'loading' ? (message || 'در حال پردازش...') : existingOrderId ? 'ادامه پرداخت' : 'ثبت سفارش و پرداخت'}</button></aside>
    </div>
  );
}
