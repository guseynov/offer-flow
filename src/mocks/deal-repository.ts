import { mockDeals } from "./deals";
import { partnerOptions } from "./partners";
import type { DealDto, UpdateDealPayload } from "@/types/deal";

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
