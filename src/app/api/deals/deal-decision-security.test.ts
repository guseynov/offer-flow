// @vitest-environment node

import { describe, expect, it } from "vitest";
import { POST as createDeal } from "@/app/api/deals/route";
import { GET as getDeal } from "@/app/api/deals/[id]/route";
import { POST as approveDeal } from "@/app/api/deals/[id]/approve/route";
import { POST as rejectDeal } from "@/app/api/deals/[id]/reject/route";
import type { DealDetailResponseDto, DealDto } from "@/types/deal";

const routeContext = (id: string) => ({ params: Promise.resolve({ id }) });

async function createPendingDeal() {
  const response = await createDeal(
    new Request("http://localhost/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: `Decision test ${crypto.randomUUID()}`,
        description: "A test offer for concurrent review decisions.",
        category: "services",
        priceCents: 5000,
        status: "pending",
        partnerId: "partner-006",
        startsAt: "2026-08-01T09:00:00.000Z",
        endsAt: "2026-08-02T18:00:00.000Z",
      }),
    }),
  );
  const body = (await response.json()) as { data: DealDto };
  return body.data;
}

function createDecisionRequest(
  endpoint: "approve" | "reject",
  expectedUpdatedAt: string,
  requestId = crypto.randomUUID(),
) {
  return new Request(`http://localhost/api/deals/id/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expectedUpdatedAt, requestId }),
  });
}

describe("deal decisions", () => {
  it("allows only one of two concurrent decisions and records one audit event", async () => {
    const deal = await createPendingDeal();
    const [approved, rejected] = await Promise.all([
      approveDeal(
        createDecisionRequest("approve", deal.updatedAt),
        routeContext(deal.id),
      ),
      rejectDeal(
        createDecisionRequest("reject", deal.updatedAt),
        routeContext(deal.id),
      ),
    ]);

    expect([approved.status, rejected.status].sort()).toEqual([200, 409]);

    const detailResponse = await getDeal(
      new Request(`http://localhost/api/deals/${deal.id}`),
      routeContext(deal.id),
    );
    const detail = (await detailResponse.json()) as DealDetailResponseDto;

    expect(detail.history).toHaveLength(1);
    expect(detail.history[0]?.previousStatus).toBe("pending");
    expect(detail.history[0]?.actorName).toBe("Public demo user");
    expect(detail.data.status).toBe(detail.history[0]?.nextStatus);
  });

  it("treats a retried request id as idempotent", async () => {
    const deal = await createPendingDeal();
    const requestId = crypto.randomUUID();
    const first = await approveDeal(
      createDecisionRequest("approve", deal.updatedAt, requestId),
      routeContext(deal.id),
    );
    const second = await approveDeal(
      createDecisionRequest("approve", deal.updatedAt, requestId),
      routeContext(deal.id),
    );
    const detailResponse = await getDeal(
      new Request(`http://localhost/api/deals/${deal.id}`),
      routeContext(deal.id),
    );
    const detail = (await detailResponse.json()) as DealDetailResponseDto;

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(detail.history.filter((event) => event.requestId === requestId)).toHaveLength(1);
  });
});
