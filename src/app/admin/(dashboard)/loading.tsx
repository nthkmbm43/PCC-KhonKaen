export default function AdminLoading() {
  return (
    <div role="status" aria-live="polite" aria-label="กำลังเปิดหน้า" className="animate-pulse space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div className="space-y-3">
          <div className="h-7 w-52 rounded-lg bg-slate-200" />
          <div className="h-4 w-72 max-w-[70vw] rounded bg-slate-100" />
        </div>
        <div className="hidden h-10 w-32 rounded-xl bg-slate-200 sm:block" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-36 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="h-4 w-24 rounded bg-slate-100" />
            <div className="mt-5 h-8 w-40 rounded bg-slate-200" />
            <div className="mt-4 h-3 w-full rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <span className="sr-only">กำลังโหลดข้อมูล กรุณารอสักครู่</span>
    </div>
  );
}
