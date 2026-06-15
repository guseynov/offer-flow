import { NextResponse } from "next/server";
import { mockDeals } from "@/mocks/deals";
import type { DealApiRouteContext, DealResponseDto } from "@/types/deal";

export async function GET(_request: Request, context: DealApiRouteContext) {
  const { id } = await context.params;
  const deal = mockDeals.find((item) => item.id === id);

  if (!deal) {
    return NextResponse.json({ message: "Deal not found" }, { status: 404 });
  }

  const response: DealResponseDto = { data: deal };

  return NextResponse.json(response);
}
