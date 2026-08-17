import { Suspense } from 'react';
import MockPaymentPage from './MockPaymentPage';

export default function PaymentMockPage() {
  return (
    <Suspense
      fallback={
        <main dir="rtl" className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-12">
          <section className="w-full rounded-3xl border bg-white p-7 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-500">در حال بارگذاری محیط تست پرداخت...</p>
          </section>
        </main>
      }
    >
      <MockPaymentPage />
    </Suspense>
  );
}
