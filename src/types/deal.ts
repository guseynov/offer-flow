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
  pageInfo: {
    total: number;
    hasNextPage: boolean;
    nextCursor: string | null;
  };
};

export type DealsQuery = {
  filters: DealFilters;
  cursor?: string;
  limit?: number;
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
  totalCount: number;
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

export type DealFormValues = {
  title: string;
  description: string;
  category: DealCategory;
  price: string;
  status: DealStatus;
  partnerId: string;
  startsAt: string;
  endsAt: string;
};

export type UpdateDealPayload = {
  title: string;
  description: string;
  category: DealCategory;
  priceCents: number;
  partnerId: string;
  startsAt: string;
  endsAt: string;
  expectedUpdatedAt: string;
};

export type DealFormErrors = Partial<Record<keyof DealFormValues, string>>;

export type PartnerOption = {
  id: string;
  name: string;
};

export type DealEditViewProps = {
  dealId: string;
};

export type DealEditFormProps = {
  dealId: string;
  initialValues: DealFormValues;
  initialUpdatedAt: string;
};

export type CreateDealStatus = "draft" | "pending";

export type CreateDealPayload = {
  title: string;
  description: string;
  category: DealCategory;
  priceCents: number;
  status: CreateDealStatus;
  partnerId: string;
  startsAt: string;
  endsAt: string;
};

export type DealCreateFormValues = Omit<DealFormValues, "status"> & {
  status: CreateDealStatus;
};

export type DealCreateFormErrors = Partial<
  Record<keyof DealCreateFormValues, string>
>;

export type DealDecision = "approved" | "rejected";

export type DealStatusActionsProps = {
  dealId: string;
  status: DealStatus;
};
