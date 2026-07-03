import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DealsTableSkeleton } from "@/components/deals/deals-table-skeleton";
import { DealsView } from "@/components/deals/deals-view";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Offers" };

export default function DealsPage() {
  return (
    <div className="mx-auto max-w-380">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-(--text-strong) sm:text-4xl">
            Offers
          </h1>
        </div>
        <Button asChild className="self-start sm:self-auto">
          <Link href="/dashboard/deals/new">Create offer</Link>
        </Button>
      </div>
      <div className="mt-8">
        <Suspense fallback={<DealsTableSkeleton />}>
          <DealsView />
        </Suspense>
      </div>
    </div>
  );
}
