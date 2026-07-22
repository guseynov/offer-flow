"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getDeals } from "@/lib/api/deals";
import {
  hasActiveDealFilters,
  parseDealFilters,
} from "@/lib/deal-filters";
import { mapDealDtosToDeals } from "@/lib/mappers/deal";
import { dealKeys } from "@/lib/query-keys";
import type { DealFilterKey, DealFilters, DealsResponseDto } from "@/types/deal";
import { DealsDensityControl } from "./deals-density-control";
import { DealsEmptyState } from "./deals-empty-state";
import { DealsErrorState } from "./deals-error-state";
import { DealsFilters } from "./deals-filters";
import { DealsPagination } from "./deals-pagination";
import { DealsTable } from "./deals-table";
import { DealsTableSkeleton } from "./deals-table-skeleton";

const filterKeys: DealFilterKey[] = ["q", "status", "category"];

function parsePage(searchParams: URLSearchParams) {
  const page = Number(searchParams.get("page") ?? "1");

  if (Number.isInteger(page) && page >= 1 && page <= 1000) {
    return page;
  }

  return 1;
}

export function DealsView({
  initialPage,
  initialFilters,
}: {
  initialPage?: DealsResponseDto;
  initialFilters?: DealFilters;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters live in the URL so views are shareable and browser navigation restores them.
  const filters = parseDealFilters(new URLSearchParams(searchParams.toString()));
  const page = parsePage(new URLSearchParams(searchParams.toString()));
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(filters.query);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [filters.query]);

  const queryFilters = { ...filters, query: debouncedQuery };
  const initialDataMatchesQuery =
    initialFilters?.query === queryFilters.query &&
    initialFilters.status === queryFilters.status &&
    initialFilters.category === queryFilters.category &&
    initialPage?.pageInfo.page === page;
  const dealsQuery = useQuery({
    queryKey: dealKeys.list(queryFilters, page),
    queryFn: () => getDeals({ filters: queryFilters, page, limit: 20 }),
    placeholderData: keepPreviousData,
    initialData: initialPage && initialDataMatchesQuery ? initialPage : undefined,
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

    nextParams.delete("page");

    updateUrl(nextParams, key === "q" ? "replace" : "push");
  }

  function clearFilters() {
    const nextParams = new URLSearchParams(searchParams.toString());

    [...filterKeys, "page"].forEach((key) => nextParams.delete(key));
    updateUrl(nextParams);
  }

  function changePage(nextPage: number) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (nextPage === 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(nextPage));
    }

    updateUrl(nextParams);
  }

  const visibleDeals = mapDealDtosToDeals(dealsQuery.data?.data ?? []);
  const pageInfo = dealsQuery.data?.pageInfo;
  const hasActiveFilters = hasActiveDealFilters(filters);

  return (
    <>
      <DealsFilters
        filters={filters}
        onFilterChange={changeFilter}
        onClear={clearFilters}
      />
      <DealsDensityControl />
      {dealsQuery.isPending ? <DealsTableSkeleton /> : null}
      {dealsQuery.isError ? (
        <DealsErrorState onRetry={() => void dealsQuery.refetch()} />
      ) : null}
      {!dealsQuery.isPending && !dealsQuery.isError && visibleDeals.length === 0 && (
        <DealsEmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      )}
      {!dealsQuery.isError && pageInfo && visibleDeals.length > 0 && (
        <>
          <div aria-busy={dealsQuery.isFetching}>
            <DealsTable deals={visibleDeals} />
          </div>
          <DealsPagination
            pageInfo={pageInfo}
            disabled={dealsQuery.isFetching}
            onPageChange={changePage}
          />
        </>
      )}
    </>
  );
}
