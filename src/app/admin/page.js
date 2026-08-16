import Link from 'next/link';

const cards = [
  { href: '/admin/reviews', title: 'نظرات', description: 'بررسی و مدیریت نظرات مشتریان', icon: '💬' },
  { href: '/admin/products', title: 'محصولات', description: 'مدیریت محصولات و موجودی', icon: '📦' },
  { href: '/admin/orders', title: 'سفارش‌ها', description: 'پیگیری و مدیریت سفارش‌ها', icon: '🧾' },
  { href: '/admin/customers', title: 'مشتریان', description: 'مشاهده و مدیریت مشتریان', icon: '👥' },
];

export default function AdminDashboardPage() {
  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold text-slate-500">پنل مدیریت</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">مدیریت فروشگاه</h1>
        <p className="mt-2 text-slate-600">مدیریت بخش‌های اصلی فروشگاه از یک فضای ساده و سریع.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="group rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-2xl">{card.icon}</div>
            <h2 className="mt-5 font-extrabold">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
