import { NextResponse } from "next/server";
import { getAllDeals } from "@/mocks/deal-repository";
import type { DealsResponseDto } from "@/types/deal";

export async function GET() {
  const response: DealsResponseDto = { data: getAllDeals() };

  return NextResponse.json(response);
}
