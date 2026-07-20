import type { DealFilters } from "@/types/deal";

export const dealKeys = {
  all: ["deals"] as const,
  list: (filters: DealFilters) => ["deals", "list", filters] as const,
  dashboard: ["dashboard", "deals"] as const,
  detail: (dealId: string) => ["deal", dealId] as const,
};
