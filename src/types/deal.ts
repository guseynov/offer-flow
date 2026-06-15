export type DealStatus = "draft" | "pending" | "approved" | "rejected";

export type DealCategory =
  | "food-drink"
  | "wellness"
  | "home"
  | "experiences"
  | "services";

export type DealDto = {
  id: string;
  title: string;
  description: string;
  category: DealCategory;
  priceCents: number;
  status: DealStatus;
  partnerId: string;
  partnerName: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
};

export type DealsResponseDto = {
  data: DealDto[];
};

export type DealResponseDto = {
  data: DealDto;
};

export type Deal = {
  id: string;
  title: string;
  category: DealCategory;
  categoryLabel: string;
  formattedPrice: string;
  status: DealStatus;
  partnerName: string;
  dateRangeLabel: string;
  updatedAtLabel: string;
};

export type DealDetail = Deal & {
  description: string;
  startsAtLabel: string;
  endsAtLabel: string;
  createdAtLabel: string;
};

export type DealFilters = {
  query: string;
  status?: DealStatus;
  category?: DealCategory;
};

export type DealFilterKey = "q" | "status" | "category";

export type DealFilterOption<T extends string> = {
  value: T;
  label: string;
};

export type DealDetailPageProps = {
  params: Promise<{ id: string }>;
};

export type DealDetailViewProps = {
  dealId: string;
};

export type DealsTableProps = {
  deals: Deal[];
};

export type DealsFiltersProps = {
  filters: DealFilters;
  onFilterChange: (key: DealFilterKey, value: string) => void;
  onClear: () => void;
};

export type DealsEmptyStateProps = {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

export type DealsRequestState =
  | { status: "loading"; deals: Deal[] }
  | { status: "success"; deals: Deal[] }
  | { status: "error"; deals: Deal[] };

export type DealsErrorStateProps = {
  onRetry: () => void;
};

export type DealDetailErrorProps = {
  onRetry: () => void;
};

export type DealApiRouteContext = {
  params: Promise<{ id: string }>;
};

export type DealDetailContentProps = {
  deal: DealDetail;
};
