"use client";

import { useQuery } from "@tanstack/react-query";
import { getDealDetail } from "@/lib/api/deals";
import { isApiNotFound } from "@/lib/api/errors";
import { mapDealDtoToDetail } from "@/lib/mappers/deal";
import { dealKeys } from "@/lib/query-keys";
import type { DealDetailViewProps } from "@/types/deal";
import { DealDetailContent } from "./deal-detail-content";
import { DealDetailError } from "./deal-detail-error";
import { DealDetailSkeleton } from "./deal-detail-skeleton";
import { DealNotFound } from "./deal-not-found";

export function DealDetailView({
  dealId,
  initialData,
}: DealDetailViewProps) {
  const dealQuery = useQuery({
    queryKey: dealKeys.detailView(dealId),
    queryFn: () => getDealDetail(dealId),
    initialData,
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
    <DealDetailContent
      deal={mapDealDtoToDetail(dealQuery.data.data)}
      history={dealQuery.data.history}
    />
  );
}
