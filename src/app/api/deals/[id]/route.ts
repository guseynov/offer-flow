import { NextResponse } from "next/server";
import {
  getDealByIdFromStore,
  updateDealInStore,
} from "@/mocks/deal-repository";
import { updateDealPayloadSchema } from "@/lib/schemas/deal";
import type { DealApiRouteContext, DealResponseDto } from "@/types/deal";

export async function GET(_request: Request, context: DealApiRouteContext) {
  const { id } = await context.params;
  const deal = getDealByIdFromStore(id);

  if (!deal) {
    return NextResponse.json({ message: "Deal not found" }, { status: 404 });
  }

  const response: DealResponseDto = { data: deal };

  return NextResponse.json(response);
}

export async function PATCH(request: Request, context: DealApiRouteContext) {
  const { id } = await context.params;
  const payloadResult = updateDealPayloadSchema.safeParse(await request.json());

  if (!payloadResult.success) {
    return NextResponse.json(
      { message: "Invalid deal update", issues: payloadResult.error.issues },
      { status: 400 },
    );
  }

  const deal = updateDealInStore(id, payloadResult.data);

  if (!deal) {
    return NextResponse.json({ message: "Deal or partner not found" }, { status: 404 });
  }

  const response: DealResponseDto = { data: deal };

  return NextResponse.json(response);
}
