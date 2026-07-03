import clsx from "clsx";
import { Skeleton } from "@/components/ui/skeleton";

export function DealsTableSkeleton() {
  return (
    <div
      aria-label="Loading offers"
      aria-live="polite"
      className="ui-data-grid overflow-hidden rounded-[0.9rem]"
    >
      <div className="border-b border-white/6 bg-[rgba(255,255,255,0.02)] px-6 py-4">
        <Skeleton className="h-3 w-72" />
      </div>
      <div className="divide-y divide-white/6 px-6">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex items-center gap-8 py-5">
            <div className="min-w-52 flex-1 space-y-2">
              <Skeleton className="h-4 w-48 bg-white/12" />
              <Skeleton className="h-3 w-20" />
            </div>
            {[28, 36, 24, 32, 40].map((width, cellIndex) => (
              <Skeleton
                key={cellIndex}
                className={clsx("hidden h-4 lg:block")}
                style={{ width: `${width * 4}px` }}
              />
            ))}
          </div>
        ))}
      </div>
      <span className="sr-only">Loading offers…</span>
    </div>
  );
}
