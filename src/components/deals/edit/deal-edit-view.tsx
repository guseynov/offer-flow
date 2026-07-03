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
        className="ui-link inline-flex items-center gap-2 text-sm font-semibold"
      >
        <span aria-hidden="true">←</span>
        Back to offer
      </Link>
      <div className="mt-7">
        <p className="ui-kicker">Offer editor</p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-(--text-strong) sm:text-4xl">
          Edit {dealQuery.data.title}
        </h1>
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
