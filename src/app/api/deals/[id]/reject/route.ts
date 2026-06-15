import { NextResponse } from "next/server";
import { setDealStatusInStore } from "@/mocks/deal-repository";
import type { DealApiRouteContext, DealResponseDto } from "@/types/deal";

export async function POST(_request: Request, context: DealApiRouteContext) {
  const { id } = await context.params;
  const deal = setDealStatusInStore(id, "rejected");

  if (!deal) {
    return NextResponse.json({ message: "Deal not found" }, { status: 404 });
  }

  const response: DealResponseDto = { data: deal };

  return NextResponse.json(response);
}
