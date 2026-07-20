import type {
  Deal,
  DealCategory,
  DealFilterOption,
  DealFilters,
  DealStatus,
} from "@/types/deal";

export const statusFilterOptions: DealFilterOption<DealStatus>[] = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export const categoryFilterOptions: DealFilterOption<DealCategory>[] = [
  { value: "food-drink", label: "Food & drink" },
  { value: "wellness", label: "Wellness" },
  { value: "home", label: "Home" },
  { value: "experiences", label: "Experiences" },
  { value: "services", label: "Services" },
];

const validStatuses = new Set(statusFilterOptions.map((option) => option.value));
const validCategories = new Set(categoryFilterOptions.map((option) => option.value));

function parseStatus(value: string | null): DealStatus | undefined {
  if (value && validStatuses.has(value as DealStatus)) {
    return value as DealStatus;
  }

  return undefined;
}

function parseCategory(value: string | null): DealCategory | undefined {
  if (value && validCategories.has(value as DealCategory)) {
    return value as DealCategory;
  }

  return undefined;
}

export function parseDealFilters(searchParams: URLSearchParams): DealFilters {
  return {
    query: searchParams.get("q")?.trim() ?? "",
    status: parseStatus(searchParams.get("status")),
    category: parseCategory(searchParams.get("category")),
  };
}

type FilterableDeal = Pick<
  Deal,
  "title" | "partnerName" | "status" | "category"
>;

export function filterDeals<T extends FilterableDeal>(
  deals: T[],
  filters: DealFilters,
): T[] {
  const normalizedQuery = filters.query.toLocaleLowerCase();

  return deals.filter((deal) => {
    const searchableText = `${deal.title} ${deal.partnerName}`.toLocaleLowerCase();

    if (!searchableText.includes(normalizedQuery)) {
      return false;
    }

    if (filters.status && deal.status !== filters.status) {
      return false;
    }

    if (filters.category && deal.category !== filters.category) {
      return false;
    }

    return true;
  });
}

export function hasActiveDealFilters(filters: DealFilters): boolean {
  return Boolean(filters.query || filters.status || filters.category);
}
