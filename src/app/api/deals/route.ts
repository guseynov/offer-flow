import { NextResponse } from "next/server";
import { createDealPayloadSchema } from "@/lib/schemas/deal";
import {
  createDealInStore,
  getAllDeals,
} from "@/mocks/deal-repository";
import type { DealResponseDto, DealsResponseDto } from "@/types/deal";

export async function GET() {
  const response: DealsResponseDto = { data: getAllDeals() };

  return NextResponse.json(response);
}

export async function POST(request: Request) {
  const payloadResult = createDealPayloadSchema.safeParse(await request.json());

  if (!payloadResult.success) {
    return NextResponse.json(
      { message: "Invalid deal", issues: payloadResult.error.issues },
      { status: 400 },
    );
  }

  const deal = createDealInStore(payloadResult.data);

  if (!deal) {
    return NextResponse.json({ message: "Partner not found" }, { status: 404 });
  }

  const response: DealResponseDto = { data: deal };

  return NextResponse.json(response, { status: 201 });
}
