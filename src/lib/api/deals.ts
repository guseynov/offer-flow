import { apiClient } from "./client";
import {
  dealResponseSchema,
  dealsResponseSchema,
} from "@/lib/schemas/deal";
import type {
  CreateDealPayload,
  DealDecision,
  DealDto,
  DealResponseDto,
  DealsResponseDto,
  DealsQuery,
  UpdateDealPayload,
} from "@/types/deal";

export async function getDeals({
  filters,
  cursor,
  limit = 20,
}: DealsQuery): Promise<DealsResponseDto> {
  const response = await apiClient.get<DealsResponseDto>("/deals", {
    params: {
      q: filters.query || undefined,
      status: filters.status,
      category: filters.category,
      cursor,
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
): Promise<DealDto> {
  let endpoint = `/deals/${dealId}/approve`;

  if (decision === "rejected") {
    endpoint = `/deals/${dealId}/reject`;
  }

  const response = await apiClient.post<DealResponseDto>(endpoint);
  const validatedResponse = dealResponseSchema.parse(response.data);

  return validatedResponse.data;
}
