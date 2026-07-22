import type { DashboardDataDto } from "@/lib/dashboard-data";
import type {
  CreateDealPayload,
  DealAuditEventDto,
  DealDecision,
  DealDecisionPayload,
  DealDto,
  DealFilters,
  UpdateDealPayload,
} from "@/types/deal";

export type DealUpdateResult =
  | { status: "updated"; deal: DealDto }
  | { status: "conflict"; deal: DealDto }
  | { status: "not_found" };

export type DealDecisionResult =
  | { status: "updated"; deal: DealDto; event: DealAuditEventDto }
  | { status: "conflict"; deal: DealDto }
  | { status: "not_found" };

export type DealDecisionInput = DealDecisionPayload & {
  decision: DealDecision;
  actorId: string;
  actorName: string;
};

export type DealsPageResult = {
  deals: DealDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type DealsPageInput = {
  filters: DealFilters;
  page: number;
  limit: number;
};

export type MutationRateLimitInput = {
  scopePrefix: string;
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
  getDealsPage(input: DealsPageInput): Promise<DealsPageResult>;
  getDealById(dealId: string): Promise<DealDto | undefined>;
  getDealHistory(dealId: string): Promise<DealAuditEventDto[]>;
  updateDeal(
    dealId: string,
    payload: UpdateDealPayload,
  ): Promise<DealUpdateResult>;
  createDeal(payload: CreateDealPayload): Promise<DealDto | undefined>;
  setDealStatus(
    dealId: string,
    input: DealDecisionInput,
  ): Promise<DealDecisionResult>;
  getDashboardData(): Promise<DashboardDataDto>;
  consumeMutationRateLimit(
    input: MutationRateLimitInput,
  ): Promise<MutationRateLimitResult>;
  checkReadiness(): Promise<boolean>;
  close?(): Promise<void>;
}
