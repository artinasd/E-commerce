import { requireRole } from '../../../lib/auth/session.js';
import { listAdminReviews } from '../../../server/admin/reviews.js';

const statusLabels = { PENDING: 'در انتظار بررسی', APPROVED: 'تأیید شده', REJECTED: 'رد شده' };

export default async function AdminReviewsPage({ searchParams }) {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  const params = await searchParams;
  const status = ['PENDING', 'APPROVED', 'REJECTED'].includes(params?.status) ? params.status : 'PENDING';
  const result = await listAdminReviews({ status, limit: 50, offset: 0 });

  return (
    <section dir="rtl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">مدیریت محتوا</p>
          <h1 className="mt-1 text-3xl font-black">نظرات مشتریان</h1>
        </div>
        <div className="flex gap-2 text-sm font-bold">
          {Object.entries(statusLabels).map(([key, label]) => (
            <a key={key} href={`/admin/reviews?status=${key}`} className={`rounded-full border px-3 py-2 ${status === key ? 'bg-slate-950 text-white' : 'bg-white'}`}>{label}</a>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {result.reviews.length === 0 ? (
          <div className="p-10 text-center text-slate-500">نظری در این وضعیت وجود ندارد.</div>
        ) : (
          <div className="divide-y">
            {result.reviews.map((review) => (
              <article key={review.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-extrabold">{review.productName}</h2>
                    <p className="mt-1 text-sm text-slate-500">{review.authorName} · {review.rating} از ۵</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{statusLabels[review.status]}</span>
                </div>
                {review.title && <h3 className="mt-4 font-bold">{review.title}</h3>}
                {review.content && <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-700">{review.content}</p>}
                <p className="mt-3 text-xs text-slate-400">{review.createdAt ? new Date(review.createdAt).toLocaleString('fa-IR') : ''}</p>
                {review.status === 'PENDING' && (
                  <div className="mt-4 flex gap-2">
                    <form action={`/api/admin/reviews/${review.id}/action`} method="post">
                      <input type="hidden" name="status" value="APPROVED" />
                      <button className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white">تأیید</button>
                    </form>
                    <form action={`/api/admin/reviews/${review.id}/action`} method="post">
                      <input type="hidden" name="status" value="REJECTED" />
                      <button className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white">رد کردن</button>
                    </form>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
