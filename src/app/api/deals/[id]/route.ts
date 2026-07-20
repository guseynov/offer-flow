import { NextResponse } from "next/server";
import {
  getJsonRequestError,
  parseJsonRequest,
} from "@/lib/api/parse-json-request";
import {
  getDealById,
  updateDeal,
} from "@/lib/server/deal-repository";
import { updateDealPayloadSchema } from "@/lib/schemas/deal";
import { getMutationRateLimitResponse } from "@/lib/server/mutation-rate-limit";
import type { DealApiRouteContext, DealResponseDto } from "@/types/deal";

export async function GET(_request: Request, context: DealApiRouteContext) {
  const { id } = await context.params;
  const deal = await getDealById(id);

  if (!deal) {
    return NextResponse.json({ message: "Deal not found" }, { status: 404 });
  }

  const response: DealResponseDto = { data: deal };

  return NextResponse.json(response);
}

export async function PATCH(request: Request, context: DealApiRouteContext) {
  const rateLimitResponse = await getMutationRateLimitResponse(request);

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { id } = await context.params;
  const bodyResult = await parseJsonRequest(request);

  if (!bodyResult.success) {
    const error = getJsonRequestError(bodyResult.reason);
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  const payloadResult = updateDealPayloadSchema.safeParse(bodyResult.data);

  if (!payloadResult.success) {
    return NextResponse.json(
      { message: "Invalid deal update", issues: payloadResult.error.issues },
      { status: 400 },
    );
  }

  const updateResult = await updateDeal(id, payloadResult.data);

  if (updateResult.status === "not_found") {
    return NextResponse.json({ message: "Deal or partner not found" }, { status: 404 });
  }

  if (updateResult.status === "conflict") {
    return NextResponse.json(
      {
        message: "Deal changed since it was loaded",
        data: updateResult.deal,
      },
      { status: 409 },
    );
  }

  const response: DealResponseDto = { data: updateResult.deal };

  return NextResponse.json(response);
}
