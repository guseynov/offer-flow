"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getDealById } from "@/lib/api/deals";
import { mapDealDtoToFormValues } from "@/lib/mappers/deal";
import { dealKeys } from "@/lib/query-keys";
import type { DealEditViewProps } from "@/types/deal";
import { DealDetailError } from "../detail/deal-detail-error";
import { DealDetailSkeleton } from "../detail/deal-detail-skeleton";
import { DealEditForm } from "./deal-edit-form";

export function DealEditView({ dealId }: DealEditViewProps) {
  const dealQuery = useQuery({
    queryKey: dealKeys.detail(dealId),
    queryFn: () => getDealById(dealId),
  });

  if (dealQuery.isPending) {
    return <DealDetailSkeleton />;
  }

  if (dealQuery.isError) {
    return <DealDetailError onRetry={() => void dealQuery.refetch()} />;
  }

  return (
    <div>
      <Link
        href={`/dashboard/deals/${dealId}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-700 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
      >
        <span aria-hidden="true">←</span>
        Back to deal
      </Link>
      <div className="mt-7">
        <p className="text-sm font-semibold text-emerald-700">Deal editor</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Edit {dealQuery.data.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Update the deal record. Form values are converted to an API payload at submission time.
        </p>
      </div>
      <div className="mt-8">
        <DealEditForm
          dealId={dealId}
          initialValues={mapDealDtoToFormValues(dealQuery.data)}
        />
      </div>
    </div>
  );
}
