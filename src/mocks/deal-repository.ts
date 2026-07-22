import { mockDeals } from "./deals";
import { partnerOptions } from "./partners";
import { filterDeals } from "@/lib/deal-filters";
import {
  getDashboardStatusSeries,
  getDashboardSummary,
  getPendingDeals,
  getRecentDeals,
} from "@/lib/dashboard-data";
import type {
  DealDecisionInput,
  DealDecisionResult,
  DealRepository,
  DealsPageResult,
  DealUpdateResult,
} from "@/lib/server/deal-repository-types";
import type {
  CreateDealPayload,
  DealAuditEventDto,
  DealDto,
  UpdateDealPayload,
  DealFilters,
} from "@/types/deal";

type DealStoreGlobal = typeof globalThis & {
  commerceOpsDeals?: DealDto[];
  commerceOpsDealAuditEvents?: DealAuditEventDto[];
  commerceOpsMutationRateLimits?: Map<
    string,
    { count: number; windowStartedAt: number }
  >;
};

const dealStoreGlobal = globalThis as DealStoreGlobal;

function getNextUpdatedAt(currentUpdatedAt: string): string {
  const nextTimestamp = Math.max(
    Date.now(),
    new Date(currentUpdatedAt).getTime() + 1,
  );

  return new Date(nextTimestamp).toISOString();
}

function getStore(): DealDto[] {
  if (!dealStoreGlobal.commerceOpsDeals) {
    dealStoreGlobal.commerceOpsDeals = structuredClone(mockDeals);
  } else {
    const existingIds = new Set(
      dealStoreGlobal.commerceOpsDeals.map((deal) => deal.id),
    );
    const missingDeals = mockDeals.filter((deal) => !existingIds.has(deal.id));

    dealStoreGlobal.commerceOpsDeals.push(...structuredClone(missingDeals));
  }

  return dealStoreGlobal.commerceOpsDeals;
}

function getAuditStore(): DealAuditEventDto[] {
  dealStoreGlobal.commerceOpsDealAuditEvents ??= [];
  return dealStoreGlobal.commerceOpsDealAuditEvents;
}

function getRateLimitStore() {
  dealStoreGlobal.commerceOpsMutationRateLimits ??= new Map();
  return dealStoreGlobal.commerceOpsMutationRateLimits;
}

function consumeRateLimitCounter(
  scope: string,
  limit: number,
  windowMilliseconds: number,
  now: number,
) {
  const store = getRateLimitStore();
  const current = store.get(scope);
  const expired =
    !current || now - current.windowStartedAt >= windowMilliseconds;
  const next = expired
    ? { count: 1, windowStartedAt: now }
    : { ...current, count: current.count + 1 };

  store.set(scope, next);

  return {
    allowed: next.count <= limit,
    remaining: Math.max(0, limit - next.count),
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((next.windowStartedAt + windowMilliseconds - now) / 1000),
    ),
  };
}

export function getAllDeals(): DealDto[] {
  return getStore().map((deal) => ({ ...deal }));
}

export function getDealsPageFromStore({
  filters,
  page,
  limit,
}: {
  filters: DealFilters;
  page: number;
  limit: number;
}): DealsPageResult {
  const filteredDeals = filterDeals(getStore(), filters).sort((left, right) => {
    const updatedAtComparison = right.updatedAt.localeCompare(left.updatedAt);

    if (updatedAtComparison !== 0) {
      return updatedAtComparison;
    }

    return right.id.localeCompare(left.id);
  });
  const startIndex = (page - 1) * limit;
  const pageDeals = filteredDeals.slice(startIndex, startIndex + limit);
  const total = filteredDeals.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    deals: pageDeals.map((deal) => ({ ...deal })),
    total,
    page,
    pageSize: limit,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
}

export function getDealByIdFromStore(dealId: string): DealDto | undefined {
  const deal = getStore().find((item) => item.id === dealId);

  if (deal) {
    return { ...deal };
  }

  return undefined;
}

export function updateDealInStore(
  dealId: string,
  payload: UpdateDealPayload,
): DealUpdateResult {
  const store = getStore();
  const dealIndex = store.findIndex((item) => item.id === dealId);
  const currentDeal = store[dealIndex];
  const partner = partnerOptions.find((item) => item.id === payload.partnerId);

  if (!currentDeal || !partner) {
    return { status: "not_found" };
  }

  if (currentDeal.updatedAt !== payload.expectedUpdatedAt) {
    return { status: "conflict", deal: { ...currentDeal } };
  }

  const updatedDeal: DealDto = {
    ...currentDeal,
    title: payload.title,
    description: payload.description,
    category: payload.category,
    priceCents: payload.priceCents,
    partnerId: payload.partnerId,
    startsAt: payload.startsAt,
    endsAt: payload.endsAt,
    partnerName: partner.name,
    updatedAt: getNextUpdatedAt(currentDeal.updatedAt),
  };

  store[dealIndex] = updatedDeal;

  return { status: "updated", deal: { ...updatedDeal } };
}


export function createDealInStore(
  payload: CreateDealPayload,
): DealDto | undefined {
  const partner = partnerOptions.find((item) => item.id === payload.partnerId);

  if (!partner) {
    return undefined;
  }

  const timestamp = new Date().toISOString();
  const deal: DealDto = {
    id: `deal-${crypto.randomUUID()}`,
    ...payload,
    partnerName: partner.name,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  getStore().unshift(deal);

  return { ...deal };
}

export function setDealStatusInStore(
  dealId: string,
  input: DealDecisionInput,
): DealDecisionResult {
  const store = getStore();
  const existingEvent = getAuditStore().find(
    (event) => event.requestId === input.requestId,
  );
  const dealIndex = store.findIndex((item) => item.id === dealId);
  const currentDeal = store[dealIndex];

  if (!currentDeal) {
    return { status: "not_found" };
  }

  if (existingEvent?.dealId === dealId) {
    return {
      status: "updated",
      deal: { ...currentDeal },
      event: { ...existingEvent },
    };
  }

  if (
    existingEvent ||
    currentDeal.updatedAt !== input.expectedUpdatedAt ||
    currentDeal.status === input.decision
  ) {
    return { status: "conflict", deal: { ...currentDeal } };
  }

  const updatedDeal: DealDto = {
    ...currentDeal,
    status: input.decision,
    updatedAt: getNextUpdatedAt(currentDeal.updatedAt),
  };
  const event: DealAuditEventDto = {
    id: `event-${crypto.randomUUID()}`,
    dealId,
    previousStatus: currentDeal.status,
    nextStatus: input.decision,
    actorId: input.actorId,
    actorName: input.actorName,
    reason: input.reason ?? null,
    requestId: input.requestId,
    createdAt: updatedDeal.updatedAt,
  };

  store[dealIndex] = updatedDeal;
  getAuditStore().unshift(event);

  return { status: "updated", deal: { ...updatedDeal }, event: { ...event } };
}

export const memoryDealRepository: DealRepository = {
  async checkReadiness() {
    return true;
  },
  async getDealsPage(input) {
    return getDealsPageFromStore(input);
  },
  async getDealById(dealId) {
    return getDealByIdFromStore(dealId);
  },
  async getDealHistory(dealId) {
    return getAuditStore()
      .filter((event) => event.dealId === dealId)
      .map((event) => ({ ...event }));
  },
  async updateDeal(dealId, payload) {
    return updateDealInStore(dealId, payload);
  },
  async createDeal(payload) {
    return createDealInStore(payload);
  },
  async setDealStatus(dealId, input) {
    return setDealStatusInStore(dealId, input);
  },
  async getDashboardData() {
    const deals = getAllDeals();

    return {
      summary: getDashboardSummary(deals),
      statusSeries: getDashboardStatusSeries(deals),
      pendingDeals: getPendingDeals(deals).slice(0, 5),
      recentDeals: getRecentDeals(deals, 5),
    };
  },
  async consumeMutationRateLimit(input) {
    const now = Date.now();
    const windowMilliseconds = input.windowSeconds * 1000;
    const globalCounter = consumeRateLimitCounter(
      `${input.scopePrefix}:global`,
      input.globalLimit,
      windowMilliseconds,
      now,
    );

    if (!globalCounter.allowed) {
      return {
        allowed: false,
        limit: input.globalLimit,
        remaining: 0,
        retryAfterSeconds: globalCounter.retryAfterSeconds,
      };
    }

    const clientCounter = consumeRateLimitCounter(
      `${input.scopePrefix}:client:${input.clientKey}`,
      input.clientLimit,
      windowMilliseconds,
      now,
    );

    return {
      allowed: clientCounter.allowed,
      limit: clientCounter.allowed ? input.globalLimit : input.clientLimit,
      remaining: Math.min(
        globalCounter.remaining,
        clientCounter.remaining,
      ),
      retryAfterSeconds: Math.max(
        globalCounter.retryAfterSeconds,
        clientCounter.retryAfterSeconds,
      ),
    };
  },
};
