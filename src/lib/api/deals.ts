import { apiClient } from "./client";
import {
  dealResponseSchema,
  dealDetailResponseSchema,
  dealsResponseSchema,
} from "@/lib/schemas/deal";
import type {
  CreateDealPayload,
  DealDecision,
  DealDecisionPayload,
  DealDetailResponseDto,
  DealDto,
  DealResponseDto,
  DealsResponseDto,
  DealsQuery,
  UpdateDealPayload,
} from "@/types/deal";

export async function getDeals({
  filters,
  page = 1,
  limit = 20,
}: DealsQuery): Promise<DealsResponseDto> {
  const response = await apiClient.get<DealsResponseDto>("/deals", {
    params: {
      q: filters.query || undefined,
      status: filters.status,
      category: filters.category,
      page,
      limit,
    },
  });
  const validatedResponse = dealsResponseSchema.parse(response.data);

  return validatedResponse;
}

export async function getDealById(dealId: string): Promise<DealDto> {
  const response = await apiClient.get<DealResponseDto>(`/deals/${dealId}`);
  const validatedResponse = dealResponseSchema.parse(response.data);

  return validatedResponse.data;
}

export async function getDealDetail(
  dealId: string,
): Promise<DealDetailResponseDto> {
  const response = await apiClient.get<DealDetailResponseDto>(`/deals/${dealId}`);
  return dealDetailResponseSchema.parse(response.data);
}

export async function updateDeal(
  dealId: string,
  payload: UpdateDealPayload,
): Promise<DealDto> {
  const response = await apiClient.patch<DealResponseDto>(
    `/deals/${dealId}`,
    payload,
  );
  const validatedResponse = dealResponseSchema.parse(response.data);

  return validatedResponse.data;
}


export async function createDeal(
  payload: CreateDealPayload,
): Promise<DealDto> {
  const response = await apiClient.post<DealResponseDto>("/deals", payload);
  const validatedResponse = dealResponseSchema.parse(response.data);

  return validatedResponse.data;
}


export async function setDealDecision(
  dealId: string,
  decision: DealDecision,
  payload: DealDecisionPayload,
): Promise<DealDto> {
  let endpoint = `/deals/${dealId}/approve`;

  if (decision === "rejected") {
    endpoint = `/deals/${dealId}/reject`;
  }

  const response = await apiClient.post<DealResponseDto>(endpoint, payload);
  const validatedResponse = dealResponseSchema.parse(response.data);

  return validatedResponse.data;
}
