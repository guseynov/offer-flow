"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getDeals } from "@/lib/api/deals";
import {
  filterDeals,
  hasActiveDealFilters,
  parseDealFilters,
} from "@/lib/deal-filters";
import { mapDealDtosToDeals } from "@/lib/mappers/deal";
import { dealKeys } from "@/lib/query-keys";
import type { DealFilterKey } from "@/types/deal";
import { DealsEmptyState } from "./deals-empty-state";
import { DealsErrorState } from "./deals-error-state";
import { DealsFilters } from "./deals-filters";
import { DealsTable } from "./deals-table";
import { DealsTableSkeleton } from "./deals-table-skeleton";

const filterKeys: DealFilterKey[] = ["q", "status", "category"];

export function DealsView() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dealsQuery = useQuery({
    queryKey: dealKeys.all,
    queryFn: getDeals,
    select: mapDealDtosToDeals,
  });

  // Filters live in the URL so views are shareable and browser navigation restores them.
  const filters = parseDealFilters(new URLSearchParams(searchParams.toString()));

  function updateUrl(nextParams: URLSearchParams) {
    const queryString = nextParams.toString();
    let destination = pathname;

    if (queryString) {
      destination = `${pathname}?${queryString}`;
    }

    router.push(destination, { scroll: false });
  }

  function changeFilter(key: DealFilterKey, value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());
    const normalizedValue = value.trim();

    if (normalizedValue) {
      nextParams.set(key, normalizedValue);
    } else {
      nextParams.delete(key);
    }

    updateUrl(nextParams);
  }

  function clearFilters() {
    const nextParams = new URLSearchParams(searchParams.toString());

    filterKeys.forEach((key) => nextParams.delete(key));
    updateUrl(nextParams);
  }

  if (dealsQuery.isPending) {
    return <DealsTableSkeleton />;
  }

  if (dealsQuery.isError) {
    return <DealsErrorState onRetry={() => void dealsQuery.refetch()} />;
  }

  const visibleDeals = filterDeals(dealsQuery.data, filters);
  const hasActiveFilters = hasActiveDealFilters(filters);

  return (
    <>
      <DealsFilters
        filters={filters}
        onFilterChange={changeFilter}
        onClear={clearFilters}
      />
      {visibleDeals.length === 0 && (
        <DealsEmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      )}
      {visibleDeals.length > 0 && <DealsTable deals={visibleDeals} />}
    </>
  );
}
