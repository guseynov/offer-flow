import { NextResponse } from "next/server";
import {
  getJsonRequestError,
  parseJsonRequest,
} from "@/lib/api/parse-json-request";
import {
  createDealPayloadSchema,
  dealsQuerySchema,
} from "@/lib/schemas/deal";
import {
  createDeal,
  getDealsPage,
} from "@/lib/server/deal-repository";
import { getMutationRateLimitResponse } from "@/lib/server/mutation-rate-limit";
import type { DealResponseDto, DealsResponseDto } from "@/types/deal";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const queryResult = dealsQuerySchema.safeParse(
    Object.fromEntries(url.searchParams.entries()),
  );

  if (!queryResult.success) {
    return NextResponse.json(
      { message: "Invalid deals query", issues: queryResult.error.issues },
      { status: 400 },
    );
  }

  const page = await getDealsPage({
    filters: {
      query: queryResult.data.q,
      status: queryResult.data.status,
      category: queryResult.data.category,
    },
    page: queryResult.data.page,
    limit: queryResult.data.limit,
  });

  const response: DealsResponseDto = {
    data: page.deals,
    pageInfo: {
      total: page.total,
      page: page.page,
      pageSize: page.pageSize,
      totalPages: page.totalPages,
      hasPreviousPage: page.hasPreviousPage,
      hasNextPage: page.hasNextPage,
    },
  };

  return NextResponse.json(response);
}

export async function POST(request: Request) {
  const rateLimitResponse = await getMutationRateLimitResponse(request);

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const bodyResult = await parseJsonRequest(request);

  if (!bodyResult.success) {
    const error = getJsonRequestError(bodyResult.reason);
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  const payloadResult = createDealPayloadSchema.safeParse(bodyResult.data);

  if (!payloadResult.success) {
    return NextResponse.json(
      { message: "Invalid deal", issues: payloadResult.error.issues },
      { status: 400 },
    );
  }

  const deal = await createDeal(payloadResult.data);

  if (!deal) {
    return NextResponse.json({ message: "Partner not found" }, { status: 404 });
  }

  const response: DealResponseDto = { data: deal };

  return NextResponse.json(response, { status: 201 });
}
