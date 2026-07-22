import type { DealFilters } from "@/types/deal";

export const dealKeys = {
  all: ["deals"] as const,
  list: (filters: DealFilters, page: number) =>
    ["deals", "list", filters, page] as const,
  dashboard: ["dashboard", "deals"] as const,
  detail: (dealId: string) => ["deal", dealId] as const,
  detailView: (dealId: string) => ["deal", dealId, "with-history"] as const,
};
