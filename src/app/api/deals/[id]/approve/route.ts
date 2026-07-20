import { NextResponse } from "next/server";
import { setDealStatus } from "@/lib/server/deal-repository";
import { getMutationRateLimitResponse } from "@/lib/server/mutation-rate-limit";
import type { DealApiRouteContext, DealResponseDto } from "@/types/deal";

export async function POST(request: Request, context: DealApiRouteContext) {
  const rateLimitResponse = await getMutationRateLimitResponse(request);

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { id } = await context.params;
  const deal = await setDealStatus(id, "approved");

  if (!deal) {
    return NextResponse.json({ message: "Deal not found" }, { status: 404 });
  }

  const response: DealResponseDto = { data: deal };

  return NextResponse.json(response);
}
