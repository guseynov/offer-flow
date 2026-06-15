import clsx from "clsx";

export function DealsTableSkeleton() {
  return (
    <div
      aria-label="Loading deals"
      aria-live="polite"
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white"
    >
      <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4">
        <div className="h-3 w-72 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="divide-y divide-slate-100 px-6">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex items-center gap-8 py-5">
            <div className="min-w-52 flex-1 space-y-2">
              <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
            </div>
            {[28, 36, 24, 32, 40].map((width, cellIndex) => (
              <div
                key={cellIndex}
                className={clsx("hidden h-4 animate-pulse rounded bg-slate-100 lg:block")}
                style={{ width: `${width * 4}px` }}
              />
            ))}
          </div>
        ))}
      </div>
      <span className="sr-only">Loading deals…</span>
    </div>
  );
}
