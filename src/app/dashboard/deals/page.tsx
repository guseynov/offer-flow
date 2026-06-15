import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { DealsTableSkeleton } from "@/components/deals/deals-table-skeleton";
import { DealsView } from "@/components/deals/deals-view";

export const metadata: Metadata = { title: "Deals" };

export default function DealsPage() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Marketplace catalog</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Deals
        </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Review the current deal catalog and open a record for more information.
          </p>
        </div>
        <Link
          href="/dashboard/deals/new"
          className="inline-flex h-11 items-center justify-center self-start rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 sm:self-auto"
        >
          New deal
        </Link>
      </div>
      <div className="mt-8">
        <Suspense fallback={<DealsTableSkeleton />}>
          <DealsView />
        </Suspense>
      </div>
    </div>
  );
}
