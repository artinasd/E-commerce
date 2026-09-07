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
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] bg-slate-50/50 -m-4 p-4 sm:-m-8 sm:p-8 rounded-3xl">
      <section className="space-y-6">
        {!existingOrderId && <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-3"><h2 className="text-base font-black text-slate-800">آدرس ارسال</h2><button type="button" onClick={() => { setNewAddress((value) => !value); resetShippingSelection(); }} className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 transition-colors hover:bg-indigo-100">{newAddress ? 'انتخاب آدرس قبلی' : '+ آدرس جدید'}</button></div>{!newAddress && <div className="mt-5 grid gap-4">{addresses.map((address) => <label key={address.id} className={`cursor-pointer rounded-2xl border p-5 transition-all ${String(selectedAddress) === String(address.id) ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-100/50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300'}`}><span className="flex gap-4"><input type="radio" name="address" checked={String(selectedAddress) === String(address.id)} onChange={() => { setSelectedAddress(address.id); resetShippingSelection(); }} className="mt-1" /><span><span className="block text-sm font-bold text-slate-800">{address.recipient_name}</span><span className="mt-2 block text-xs leading-6 text-slate-500">{address.province}، {address.city}، {address.address_line}<br />{address.postal_code} · {address.recipient_phone}</span></span></span></label>)}</div>}{newAddress && <div className="mt-5 grid gap-4 sm:grid-cols-2">{[['recipientName','نام گیرنده'],['recipientPhone','شماره موبایل'],['province','استان'],['city','شهر'],['postalCode','کد پستی'],['plaque','پلاک'],['unit','واحد']].map(([name, label]) => <input key={name} name={name} value={form[name]} onChange={updateField} placeholder={label} className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20" />)}<textarea name="addressLine" value={form.addressLine} onChange={updateField} placeholder="نشانی کامل" rows={3} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 sm:col-span-2" /></div>}</div>}
        {!existingOrderId && <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><h2 className="text-base font-black text-slate-800">روش ارسال</h2>{shippingStatus === 'loading' && <p className="mt-5 text-sm text-slate-500">{shippingMessage}</p>}{shippingStatus === 'error' && <p role="alert" className="mt-5 text-sm font-semibold text-red-600">{shippingMessage}</p>}{shippingStatus === 'empty' && <p className="mt-5 text-sm text-slate-500">{shippingMessage}</p>}{shippingMethods.length > 0 && <div className="mt-5 grid gap-4">{shippingMethods.map((method) => { const free = method.free_shipping_minimum != null && subtotal >= Number(method.free_shipping_minimum); const amount = free ? 0 : Number(method.base_amount || 0); return <label key={method.id} className={`cursor-pointer rounded-2xl border p-5 transition-all ${String(selectedShippingMethod) === String(method.id) ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-100/50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300'}`}><span className="flex items-start gap-4"><input type="radio" name="shippingMethod" checked={String(selectedShippingMethod) === String(method.id)} onChange={() => setSelectedShippingMethod(method.id)} className="mt-1" /><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-3"><span className="text-sm font-bold text-slate-800">{method.name}</span><span className="shrink-0 text-sm font-black text-slate-900">{amount === 0 ? 'رایگان' : `${money(amount)} تومان`}</span></span>{method.description && <span className="mt-2 block text-xs leading-5 text-slate-500">{method.description}</span>}{method.free_shipping_minimum != null && !free && <span className="mt-2 block text-[11px] font-bold text-indigo-600">ارسال رایگان برای خریدهای بالاتر از {money(method.free_shipping_minimum)} تومان</span>}</span></span></label>; })}</div>}</div>}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><h2 className="text-base font-black text-slate-800">کد تخفیف</h2><div className="mt-5 flex gap-3"><input value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase())} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); applyCoupon(); } }} disabled={Boolean(appliedCoupon) || couponStatus === 'loading'} maxLength={64} placeholder="مثلاً WELCOME20" className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 disabled:bg-slate-100 disabled:text-slate-500" /><button type="button" onClick={appliedCoupon ? removeCoupon : applyCoupon} disabled={couponStatus === 'loading' || (!appliedCoupon && !couponCode.trim())} className="h-12 rounded-xl bg-slate-900 px-6 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50 disabled:shadow-none">{couponStatus === 'loading' ? 'بررسی...' : appliedCoupon ? 'حذف' : 'اعمال'}</button></div>{couponMessage && <p role={couponStatus === 'error' ? 'alert' : 'status'} className={`mt-4 text-xs font-semibold ${couponStatus === 'error' ? 'text-red-600' : 'text-indigo-600'}`}>{couponMessage}</p>}</div>
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"><h2 className="text-base font-black text-slate-800">روش پرداخت</h2><div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 ring-1 ring-indigo-600/5"><p className="text-sm font-bold text-indigo-900">پرداخت آنلاین</p><p className="mt-2 text-xs leading-6 text-indigo-700/80">پس از ثبت سفارش، در صورت فعال بودن درگاه به صفحه پرداخت منتقل می‌شوید؛ در غیر این صورت وضعیت سفارش نمایش داده می‌شود.</p></div></div>
        {status === 'error' && <div role="alert" className="rounded-2xl bg-red-50 p-5 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-red-100">{message}</div>}
      </section>
      <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-indigo-100/20 lg:sticky lg:top-28"><h2 className="text-base font-black text-slate-800">خلاصه سفارش</h2><div className="mt-6 space-y-4 border-b border-slate-100 pb-6 text-sm">{(cart?.items || []).map((item) => <div key={item.id} className="flex justify-between gap-4"><span className="line-clamp-2 text-slate-600">{item.product_name} × {item.quantity}</span><span className="shrink-0 font-bold text-slate-900">{money(item.line_total)}</span></div>)}</div><div className="mt-6 flex justify-between text-sm"><span className="text-slate-600">جمع کالاها</span><span className="font-bold text-slate-900">{money(subtotal)} تومان</span></div>{displayedDiscount > 0 && <div className="mt-4 flex justify-between text-sm text-indigo-600"><span className="font-bold">تخفیف</span><span className="font-bold">− {money(displayedDiscount)} تومان</span></div>}<div className="mt-4 flex justify-between text-sm"><span className="text-slate-600">ارسال</span><span className="font-bold text-slate-900">{selectedShippingMethod ? (shippingAmount === 0 ? 'رایگان' : `${money(shippingAmount)} تومان`) : 'انتخاب نشده'}</span></div><div className="mt-4 flex justify-between"><span className="text-sm text-slate-600">تعداد کالا</span><span className="text-sm font-bold text-slate-900">{money(itemCount)}</span></div><div className="mt-6 flex justify-between border-t border-dashed border-slate-200 pt-6"><span className="font-black text-slate-800">مبلغ قابل پرداخت</span><strong className="text-2xl font-black text-slate-900">{money(displayedTotal)} <span className="text-xs font-bold text-slate-500">تومان</span></strong></div><button type="button" disabled={status === 'loading' || !cart?.items?.length || (!existingOrderId && !selectedShippingMethod)} onClick={placeOrder} className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-indigo-600 text-sm font-black text-white shadow-lg shadow-indigo-200 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50 disabled:shadow-none">{status === 'loading' ? (message || 'در حال پردازش...') : existingOrderId ? 'ادامه پرداخت' : 'ثبت سفارش و پرداخت'}</button></aside>
    </div>
  );
}
