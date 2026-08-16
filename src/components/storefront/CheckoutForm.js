'use client';

import { useState } from 'react';

export default function CheckoutForm({ addresses, cart }) {
  const [selectedAddress, setSelectedAddress] = useState(addresses.find((address) => address.is_default)?.id || addresses[0]?.id || '');
  const [newAddress, setNewAddress] = useState(false);
  const [form, setForm] = useState({ title: '', recipientName: '', phone: '', province: '', city: '', postalCode: '', addressLine: '' });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const total = Number(cart?.subtotal || 0);
  const itemCount = (cart?.items || []).reduce((sum, item) => sum + Number(item.quantity), 0);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function placeOrder() {
    setStatus('loading');
    setMessage('');
    try {
      let addressId = selectedAddress;
      if (newAddress) {
        const addressResponse = await fetch('/api/addresses', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
        });
        const addressPayload = await addressResponse.json();
        if (!addressResponse.ok) throw new Error(addressPayload?.error?.message || 'ثبت آدرس انجام نشد.');
        addressId = addressPayload.data.address.id;
      }
      if (!addressId) throw new Error('لطفاً یک آدرس انتخاب کنید.');
      const response = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ addressId }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message || 'ثبت سفارش انجام نشد.');
      window.location.href = `/orders/${encodeURIComponent(payload.data.order.id)}`;
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'خطایی رخ داد.');
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-5">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
          <div className="flex items-center justify-between gap-3"><h2 className="text-base font-black">آدرس ارسال</h2><button type="button" onClick={() => setNewAddress((value) => !value)} className="text-xs font-bold text-[var(--brand)]">{newAddress ? 'انتخاب آدرس قبلی' : '+ آدرس جدید'}</button></div>
          {!newAddress && <div className="mt-4 grid gap-3">{addresses.map((address) => <label key={address.id} className={`cursor-pointer rounded-xl border p-4 ${String(selectedAddress) === String(address.id) ? 'border-[var(--brand)] bg-red-50/40' : 'border-[var(--border)]'}`}><span className="flex gap-3"><input type="radio" name="address" checked={String(selectedAddress) === String(address.id)} onChange={() => setSelectedAddress(address.id)} /><span><span className="block text-sm font-bold">{address.title || address.recipient_name}</span><span className="mt-1 block text-xs leading-6 text-slate-500">{address.province}، {address.city}، {address.address_line}<br />{address.postal_code} · {address.phone}</span></span></span></label>)}</div>}
          {newAddress && <div className="mt-4 grid gap-3 sm:grid-cols-2">{[['title','عنوان آدرس'],['recipientName','نام گیرنده'],['phone','شماره موبایل'],['province','استان'],['city','شهر'],['postalCode','کد پستی']].map(([name, label]) => <input key={name} name={name} value={form[name]} onChange={updateField} placeholder={label} className="h-11 rounded-xl border border-[var(--border)] px-3 text-sm outline-none focus:border-[var(--brand)]" />)}<textarea name="addressLine" value={form.addressLine} onChange={updateField} placeholder="نشانی کامل" rows={3} className="rounded-xl border border-[var(--border)] px-3 py-3 text-sm outline-none focus:border-[var(--brand)] sm:col-span-2" /></div>}
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-white p-5"><h2 className="text-base font-black">روش پرداخت</h2><div className="mt-4 rounded-xl border border-[var(--brand)] bg-red-50/40 p-4"><p className="text-sm font-bold">پرداخت آنلاین</p><p className="mt-1 text-xs text-slate-500">در مرحله بعد به درگاه پرداخت امن منتقل می‌شوید.</p></div></div>
        {status === 'error' && <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{message}</div>}
      </section>

      <aside className="h-fit rounded-2xl border border-[var(--border)] bg-white p-5 lg:sticky lg:top-24"><h2 className="text-base font-black">خلاصه سفارش</h2><div className="mt-5 space-y-3 border-b border-[var(--border)] pb-5 text-sm">{(cart?.items || []).map((item) => <div key={item.id} className="flex justify-between gap-4"><span className="line-clamp-2 text-slate-500">{item.product_name} × {item.quantity}</span><span className="shrink-0 font-semibold">{new Intl.NumberFormat('fa-IR').format(Number(item.line_total))}</span></div>)}</div><div className="flex justify-between pt-5"><span className="text-sm text-slate-500">تعداد کالا</span><span className="text-sm font-bold">{new Intl.NumberFormat('fa-IR').format(itemCount)}</span></div><div className="mt-3 flex justify-between"><span className="font-bold">مبلغ قابل پرداخت</span><strong className="text-xl">{new Intl.NumberFormat('fa-IR').format(total)} <span className="text-xs font-medium text-slate-400">تومان</span></strong></div><button type="button" disabled={status === 'loading' || !cart?.items?.length} onClick={placeOrder} className="mt-6 h-12 w-full rounded-xl bg-[var(--brand)] text-sm font-bold text-white transition hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-50">{status === 'loading' ? 'در حال ثبت سفارش...' : 'ثبت سفارش'}</button></aside>
    </div>
  );
}
