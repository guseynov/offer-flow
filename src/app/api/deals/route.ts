import { NextResponse } from "next/server";
import { mockDeals } from "@/mocks/deals";
import type { DealsResponseDto } from "@/types/deal";

export async function GET() {
  const response: DealsResponseDto = { data: mockDeals };

  return NextResponse.json(response);
}
