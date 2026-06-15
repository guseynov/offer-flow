import Link from "next/link";
import type { DealDetailErrorProps } from "@/types/deal";

export function DealDetailError({ onRetry }: DealDetailErrorProps) {
  return (
    <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-14 text-center">
      <span aria-hidden="true" className="mx-auto grid size-12 place-items-center rounded-xl bg-rose-100 text-xl font-bold text-rose-700">
        !
      </span>
      <h1 className="mt-4 text-xl font-bold text-rose-950">Deal could not be loaded</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-rose-700">
        This deal may not exist, or the API response could not be validated.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
        >
          Retry
        </button>
        <Link
          href="/dashboard/deals"
          className="rounded-lg border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-800 transition-colors hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
        >
          Back to deals
        </Link>
      </div>
    </div>
  );
}
