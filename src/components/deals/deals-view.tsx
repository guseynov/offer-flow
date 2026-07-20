"use client";

import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getDeals } from "@/lib/api/deals";
import {
  hasActiveDealFilters,
  parseDealFilters,
} from "@/lib/deal-filters";
import { mapDealDtosToDeals } from "@/lib/mappers/deal";
import { dealKeys } from "@/lib/query-keys";
import type { DealFilterKey } from "@/types/deal";
import { DealsDensityControl } from "./deals-density-control";
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

  // Filters live in the URL so views are shareable and browser navigation restores them.
  const filters = parseDealFilters(new URLSearchParams(searchParams.toString()));
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(filters.query);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [filters.query]);

  const queryFilters = { ...filters, query: debouncedQuery };
  const dealsQuery = useInfiniteQuery({
    queryKey: dealKeys.list(queryFilters),
    queryFn: ({ pageParam }) =>
      getDeals({ filters: queryFilters, cursor: pageParam, limit: 20 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pageInfo.nextCursor ?? undefined,
  });

  function updateUrl(
    nextParams: URLSearchParams,
    navigation: "push" | "replace" = "push",
  ) {
    const queryString = nextParams.toString();
    let destination = pathname;

    if (queryString) {
      destination = `${pathname}?${queryString}`;
    }

    router[navigation](destination, { scroll: false });
  }

  function changeFilter(key: DealFilterKey, value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());
    const normalizedValue = value.trim();

    if (normalizedValue) {
      nextParams.set(key, normalizedValue);
    } else {
      nextParams.delete(key);
    }

    updateUrl(nextParams, key === "q" ? "replace" : "push");
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

  const visibleDeals = mapDealDtosToDeals(
    dealsQuery.data.pages.flatMap((page) => page.data),
  );
  const totalCount = dealsQuery.data.pages[0]?.pageInfo.total ?? 0;
  const hasActiveFilters = hasActiveDealFilters(filters);

  return (
    <>
      <DealsFilters
        filters={filters}
        onFilterChange={changeFilter}
        onClear={clearFilters}
      />
      <DealsDensityControl />
      {visibleDeals.length === 0 && (
        <DealsEmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      )}
      {visibleDeals.length > 0 && (
        <>
          <DealsTable deals={visibleDeals} totalCount={totalCount} />
          {dealsQuery.hasNextPage ? (
            <div className="mt-4 flex justify-center">
              <Button
                type="button"
                variant="secondary"
                disabled={dealsQuery.isFetchingNextPage}
                onClick={() => void dealsQuery.fetchNextPage()}
              >
                {dealsQuery.isFetchingNextPage
                  ? "Loading more…"
                  : "Load more offers"}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
