import { apiClient } from "./client";
import {
  dealResponseSchema,
  dealsResponseSchema,
} from "@/lib/schemas/deal";
import type {
  DealDto,
  DealResponseDto,
  DealsResponseDto,
  UpdateDealPayload,
} from "@/types/deal";

export async function getDeals(): Promise<DealDto[]> {
  const response = await apiClient.get<DealsResponseDto>("/deals");
  const validatedResponse = dealsResponseSchema.parse(response.data);

  return validatedResponse.data;
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
