// @vitest-environment node

import { describe, expect, it } from "vitest";
import { POST as approveDeal } from "@/app/api/deals/[id]/approve/route";
import {
  GET as getDeal,
  PATCH as updateDeal,
} from "@/app/api/deals/[id]/route";
import { POST as createDeal } from "@/app/api/deals/route";
import type { DealDto, UpdateDealPayload } from "@/types/deal";

async function createPendingDeal(): Promise<DealDto> {
  const response = await createDeal(
    new Request("http://localhost/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Concurrency test offer",
        description: "A unique offer used to verify guarded updates.",
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

function createUpdatePayload(deal: DealDto): UpdateDealPayload {
  return {
    title: `${deal.title} updated`,
    description: deal.description,
    category: deal.category,
    priceCents: deal.priceCents,
    partnerId: deal.partnerId,
    startsAt: deal.startsAt,
    endsAt: deal.endsAt,
    expectedUpdatedAt: deal.updatedAt,
  };
}

function createPatchRequest(payload: unknown) {
  return new Request("http://localhost/api/deals", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

describe("guarded deal updates", () => {
  it("updates metadata without changing workflow status", async () => {
    const deal = await createPendingDeal();
    const response = await updateDeal(createPatchRequest(createUpdatePayload(deal)), {
      params: Promise.resolve({ id: deal.id }),
    });
    const body = (await response.json()) as { data: DealDto };

    expect(response.status).toBe(200);
    expect(body.data.title).toBe(`${deal.title} updated`);
    expect(body.data.status).toBe("pending");
    expect(body.data.updatedAt).not.toBe(deal.updatedAt);
  });

  it("rejects attempts to bypass the decision endpoints with PATCH", async () => {
    const deal = await createPendingDeal();
    const response = await updateDeal(
      createPatchRequest({
        ...createUpdatePayload(deal),
        status: "approved",
      }),
      { params: Promise.resolve({ id: deal.id }) },
    );

    expect(response.status).toBe(400);

    const persistedResponse = await getDeal(new Request("http://localhost"), {
      params: Promise.resolve({ id: deal.id }),
    });
    const persistedBody = (await persistedResponse.json()) as { data: DealDto };

    expect(persistedBody.data.status).toBe("pending");
  });

  it("returns 409 instead of overwriting a newer review decision", async () => {
    const staleDeal = await createPendingDeal();

    const decisionResponse = await approveDeal(new Request("http://localhost"), {
      params: Promise.resolve({ id: staleDeal.id }),
    });
    expect(decisionResponse.status).toBe(200);

    const response = await updateDeal(
      createPatchRequest(createUpdatePayload(staleDeal)),
      { params: Promise.resolve({ id: staleDeal.id }) },
    );
    const body = (await response.json()) as {
      message: string;
      data: DealDto;
    };

    expect(response.status).toBe(409);
    expect(body.message).toBe("Deal changed since it was loaded");
    expect(body.data.status).toBe("approved");

    const persistedResponse = await getDeal(new Request("http://localhost"), {
      params: Promise.resolve({ id: staleDeal.id }),
    });
    const persistedBody = (await persistedResponse.json()) as { data: DealDto };

    expect(persistedBody.data.status).toBe("approved");
    expect(persistedBody.data.title).toBe(staleDeal.title);
  });
});
