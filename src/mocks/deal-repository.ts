import { mockDeals } from "./deals";
import { partnerOptions } from "./partners";
import type {
  CreateDealPayload,
  DealDecision,
  DealDto,
  UpdateDealPayload,
} from "@/types/deal";

type DealStoreGlobal = typeof globalThis & {
  commerceOpsDeals?: DealDto[];
};

const dealStoreGlobal = globalThis as DealStoreGlobal;

function getStore(): DealDto[] {
  if (!dealStoreGlobal.commerceOpsDeals) {
    dealStoreGlobal.commerceOpsDeals = structuredClone(mockDeals);
  }

  return dealStoreGlobal.commerceOpsDeals;
}

export function getAllDeals(): DealDto[] {
  return getStore().map((deal) => ({ ...deal }));
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
): DealDto | undefined {
  const store = getStore();
  const dealIndex = store.findIndex((item) => item.id === dealId);
  const currentDeal = store[dealIndex];
  const partner = partnerOptions.find((item) => item.id === payload.partnerId);

  if (!currentDeal || !partner) {
    return undefined;
  }

  const updatedDeal: DealDto = {
    ...currentDeal,
    ...payload,
    partnerName: partner.name,
    updatedAt: new Date().toISOString(),
  };

  store[dealIndex] = updatedDeal;

  return { ...updatedDeal };
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
  status: DealDecision,
): DealDto | undefined {
  const store = getStore();
  const dealIndex = store.findIndex((item) => item.id === dealId);
  const currentDeal = store[dealIndex];

  if (!currentDeal) {
    return undefined;
  }

  const updatedDeal: DealDto = {
    ...currentDeal,
    status,
    updatedAt: new Date().toISOString(),
  };

  store[dealIndex] = updatedDeal;

  return { ...updatedDeal };
}
