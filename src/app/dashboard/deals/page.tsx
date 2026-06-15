import type { Metadata } from "next";
import { Suspense } from "react";
import { DealsTableSkeleton } from "@/components/deals/deals-table-skeleton";
import { DealsView } from "@/components/deals/deals-view";

export const metadata: Metadata = { title: "Deals" };

export default function DealsPage() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <div>
        <p className="text-sm font-semibold text-emerald-700">Marketplace catalog</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Deals
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Review the current deal catalog and open a record for more information.
        </p>
      </div>
      <div className="mt-8">
        <Suspense fallback={<DealsTableSkeleton />}>
          <DealsView />
        </Suspense>
      </div>
    </div>
  );
}
