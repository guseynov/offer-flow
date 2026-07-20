// @vitest-environment node

import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/deals/route";
import { PATCH } from "@/app/api/deals/[id]/route";
import {
  MAX_DEAL_TITLE_LENGTH,
  MAX_JSON_REQUEST_BYTES,
} from "@/lib/deal-limits";

function createMalformedRequest(method: "POST" | "PATCH") {
  return new Request("http://localhost/api/deals", {
    method,
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
}

describe("malformed deal requests", () => {
  it("returns a structured 400 response for malformed create JSON", async () => {
    const response = await POST(createMalformedRequest("POST"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ message: "Malformed JSON" });
  });

  it("returns a structured 400 response for malformed update JSON", async () => {
    const response = await PATCH(createMalformedRequest("PATCH"), {
      params: Promise.resolve({ id: "deal-001" }),
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ message: "Malformed JSON" });
  });

  it("rejects request bodies larger than the configured byte limit", async () => {
    const response = await POST(
      new Request("http://localhost/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: "x".repeat(MAX_JSON_REQUEST_BYTES) }),
      }),
    );

    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({
      message: "Request body is too large",
    });
  });

  it("requires a JSON content type", async () => {
    const response = await POST(
      new Request("http://localhost/api/deals", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: "{}",
      }),
    );

    expect(response.status).toBe(415);
    await expect(response.json()).resolves.toEqual({
      message: "Content-Type must be application/json",
    });
  });

  it("rejects fields that exceed their schema limits", async () => {
    const response = await POST(
      new Request("http://localhost/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "x".repeat(MAX_DEAL_TITLE_LENGTH + 1),
          description: "A valid description for this test offer.",
          category: "services",
          priceCents: 5000,
          status: "draft",
          partnerId: "partner-006",
          startsAt: "2026-08-01T09:00:00.000Z",
          endsAt: "2026-08-02T18:00:00.000Z",
        }),
      }),
    );
    const body = (await response.json()) as {
      message: string;
      issues: Array<{ path: Array<string> }>;
    };

    expect(response.status).toBe(400);
    expect(body.message).toBe("Invalid deal");
    expect(body.issues.some((issue) => issue.path[0] === "title")).toBe(true);
  });
});
