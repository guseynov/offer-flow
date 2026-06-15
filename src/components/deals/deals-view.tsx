"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getDeals } from "@/lib/api/deals";
import {
  filterDeals,
  hasActiveDealFilters,
  parseDealFilters,
} from "@/lib/deal-filters";
import { mapDealDtosToDeals } from "@/lib/mappers/deal";
import type { DealFilterKey, DealsRequestState } from "@/types/deal";
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
  const [requestState, setRequestState] = useState<DealsRequestState>({
    status: "loading",
    deals: [],
  });

  // Filters live in the URL so views are shareable and browser navigation restores them.
  const filters = parseDealFilters(new URLSearchParams(searchParams.toString()));

  useEffect(() => {
    let ignoreResponse = false;

    getDeals()
      .then((dealDtos) => {
        if (!ignoreResponse) {
          setRequestState({
            status: "success",
            deals: mapDealDtosToDeals(dealDtos),
          });
        }
      })
      .catch(() => {
        if (!ignoreResponse) {
          setRequestState({ status: "error", deals: [] });
        }
      });

    return () => {
      ignoreResponse = true;
    };
  }, []);

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

  async function retryRequest() {
    setRequestState({ status: "loading", deals: [] });

    try {
      const dealDtos = await getDeals();
      setRequestState({
        status: "success",
        deals: mapDealDtosToDeals(dealDtos),
      });
    } catch {
      setRequestState({ status: "error", deals: [] });
    }
  }

  if (requestState.status === "loading") {
    return <DealsTableSkeleton />;
  }

  if (requestState.status === "error") {
    return <DealsErrorState onRetry={retryRequest} />;
  }

  const visibleDeals = filterDeals(requestState.deals, filters);
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
