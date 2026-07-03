import { Skeleton } from "@/components/ui/skeleton";

export function DealDetailSkeleton() {
  return (
    <div aria-label="Loading offer details" aria-live="polite" className="animate-pulse">
      <Skeleton className="h-4 w-28" />
      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-10 w-80 max-w-full" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <Skeleton className="h-48 rounded-[0.9rem]" />
          <Skeleton className="h-64 rounded-[0.9rem]" />
        </div>
        <Skeleton className="h-80 rounded-[0.9rem]" />
      </div>
      <span className="sr-only">Loading offer details…</span>
    </div>
  );
}
