"use client";

import { useQuery } from "@tanstack/react-query";
import { getDealById } from "@/lib/api/deals";
import { isApiNotFound } from "@/lib/api/errors";
import { mapDealDtoToDetail } from "@/lib/mappers/deal";
import { dealKeys } from "@/lib/query-keys";
import type { DealDetailViewProps } from "@/types/deal";
import { DealDetailContent } from "./deal-detail-content";
import { DealDetailError } from "./deal-detail-error";
import { DealDetailSkeleton } from "./deal-detail-skeleton";
import { DealNotFound } from "./deal-not-found";

export function DealDetailView({ dealId }: DealDetailViewProps) {
  const dealQuery = useQuery({
    queryKey: dealKeys.detail(dealId),
    queryFn: () => getDealById(dealId),
    select: mapDealDtoToDetail,
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

  return <DealDetailContent deal={dealQuery.data} />;
}
