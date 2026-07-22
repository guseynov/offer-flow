"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getDealById } from "@/lib/api/deals";
import { isApiNotFound } from "@/lib/api/errors";
import { mapDealDtoToFormValues } from "@/lib/mappers/deal";
import { dealKeys } from "@/lib/query-keys";
import type { DealEditViewProps } from "@/types/deal";
import { DealDetailError } from "../detail/deal-detail-error";
import { DealDetailSkeleton } from "../detail/deal-detail-skeleton";
import { DealNotFound } from "../detail/deal-not-found";
import { DealEditForm } from "./deal-edit-form";

export function DealEditView({ dealId, initialDeal }: DealEditViewProps) {
  const dealQuery = useQuery({
    queryKey: dealKeys.detail(dealId),
    queryFn: () => getDealById(dealId),
    initialData: initialDeal,
  });

  if (dealQuery.isPending) {
    return <DealDetailSkeleton />;
  }

  if (dealQuery.isError) {
    if (isApiNotFound(dealQuery.error)) {
      return <DealNotFound />;
    }

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
        <p className="mt-3 max-w-2xl text-sm text-(--text-muted)">
          Content changes preserve the current workflow status. Review
          decisions are managed from the offer detail page.
        </p>
      </div>
      <div className="mt-8">
        <DealEditForm
          dealId={dealId}
          initialValues={mapDealDtoToFormValues(dealQuery.data)}
          initialUpdatedAt={dealQuery.data.updatedAt}
        />
      </div>
    </div>
  );
}
