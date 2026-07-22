import { NextResponse } from "next/server";
import { setDealStatus } from "@/lib/server/deal-repository";
import { getMutationRateLimitResponse } from "@/lib/server/mutation-rate-limit";
import type { DealApiRouteContext, DealResponseDto } from "@/types/deal";
import { dealDecisionPayloadSchema } from "@/lib/schemas/deal";
import { getJsonRequestError, parseJsonRequest } from "@/lib/api/parse-json-request";

const publicActor = { id: "public-demo", name: "Public demo user" };

export async function POST(request: Request, context: DealApiRouteContext) {
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

  const payloadResult = dealDecisionPayloadSchema.safeParse(bodyResult.data);

  if (!payloadResult.success) {
    return NextResponse.json(
      { message: "Invalid decision", issues: payloadResult.error.issues },
      { status: 400 },
    );
  }

  const result = await setDealStatus(
    id,
    "rejected",
    payloadResult.data,
    publicActor,
  );

  if (result.status === "not_found") {
    return NextResponse.json({ message: "Deal not found" }, { status: 404 });
  }

  if (result.status === "conflict") {
    return NextResponse.json(
      { message: "Deal changed since it was loaded", data: result.deal },
      { status: 409 },
    );
  }

  const response: DealResponseDto = { data: result.deal };

  return NextResponse.json(response);
}
