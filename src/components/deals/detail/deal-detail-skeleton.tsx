export function DealDetailSkeleton() {
  return (
    <div aria-label="Loading deal details" aria-live="polite" className="animate-pulse">
      <div className="h-4 w-28 rounded bg-slate-200" />
      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="h-10 w-80 max-w-full rounded bg-slate-200" />
          <div className="h-4 w-56 rounded bg-slate-100" />
        </div>
        <div className="h-7 w-24 rounded-full bg-slate-200" />
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <div className="h-48 rounded-2xl bg-white ring-1 ring-slate-200" />
          <div className="h-64 rounded-2xl bg-white ring-1 ring-slate-200" />
        </div>
        <div className="h-80 rounded-2xl bg-white ring-1 ring-slate-200" />
      </div>
      <span className="sr-only">Loading deal details…</span>
    </div>
  );
}
