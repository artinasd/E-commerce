const highlights = [
  { title: "ارسال سریع", text: "تجربه خریدی که معطل‌تان نمی‌کند." },
  { title: "انتخاب هوشمند", text: "محصولات را ساده‌تر پیدا و مقایسه کنید." },
  { title: "خرید مطمئن", text: "اطلاعات شفاف و تجربه‌ای قابل اعتماد." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-16 lg:px-10">
        <div className="max-w-3xl">
          <span className="mb-5 inline-flex rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--muted)] shadow-sm">
            نسل تازه خرید آنلاین
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl">
            خرید آنلاین، ساده‌تر و مدرن‌تر.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-[var(--muted)] sm:text-xl">
            یک فروشگاه فارسی‌زبان با تمرکز روی سرعت، انتخاب بهتر و تجربه کاربری
            حرفه‌ای. اینجا نقطه شروع محصولی است که در ادامه به یک پلتفرم کامل
            تجارت الکترونیک تبدیل می‌شود.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 leading-7 text-[var(--muted)]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
