import type { DashboardDataDto } from "@/lib/dashboard-data";
import type {
  CreateDealPayload,
  DealDecision,
  DealDto,
  DealFilters,
  UpdateDealPayload,
} from "@/types/deal";

export type DealUpdateResult =
  | { status: "updated"; deal: DealDto }
  | { status: "conflict"; deal: DealDto }
  | { status: "not_found" };

export type DealsPageResult = {
  deals: DealDto[];
  total: number;
  hasNextPage: boolean;
  nextCursor: string | null;
};

export type DealsPageInput = {
  filters: DealFilters;
  cursor?: string;
  limit: number;
};

export type MutationRateLimitInput = {
  clientKey: string;
  clientLimit: number;
  globalLimit: number;
  windowSeconds: number;
};

export type MutationRateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

export interface DealRepository {
  getDealsPage(input: DealsPageInput): Promise<DealsPageResult | undefined>;
  getDealById(dealId: string): Promise<DealDto | undefined>;
  updateDeal(
    dealId: string,
    payload: UpdateDealPayload,
  ): Promise<DealUpdateResult>;
  createDeal(payload: CreateDealPayload): Promise<DealDto | undefined>;
  setDealStatus(
    dealId: string,
    status: DealDecision,
  ): Promise<DealDto | undefined>;
  getDashboardData(): Promise<DashboardDataDto>;
  consumeMutationRateLimit(
    input: MutationRateLimitInput,
  ): Promise<MutationRateLimitResult>;
  close?(): Promise<void>;
}
