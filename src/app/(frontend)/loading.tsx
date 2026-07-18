export default function FrontendLoading() {
  return (
    <div className="min-h-[65vh] bg-white" role="status" aria-label="กำลังเปิดหน้า">
      <div className="h-1 w-full overflow-hidden bg-brand-100">
        <div className="h-full w-1/2 animate-pulse bg-brand-600" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-2/3 max-w-xl rounded bg-slate-200" />
          <div className="h-4 w-full max-w-2xl rounded bg-slate-100" />
          <div className="h-4 w-4/5 max-w-xl rounded bg-slate-100" />
          <div className="grid gap-5 pt-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="h-48 rounded-2xl bg-slate-100" />
            <div className="h-48 rounded-2xl bg-slate-100" />
            <div className="hidden h-48 rounded-2xl bg-slate-100 lg:block" />
          </div>
        </div>
      </div>
      <span className="sr-only">กำลังโหลดข้อมูล</span>
    </div>
  );
}
