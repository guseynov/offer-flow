// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const { consumeMutationRateLimit } = vi.hoisted(() => ({
  consumeMutationRateLimit: vi.fn(),
}));

vi.mock("@/lib/server/deal-repository", () => ({
  consumeMutationRateLimit,
}));

import { getMutationRateLimitResponse } from "@/lib/server/mutation-rate-limit";

describe("mutation rate limiting", () => {
  beforeEach(() => {
    consumeMutationRateLimit.mockReset();
  });

  it("allows requests while both counters are under their limits", async () => {
    consumeMutationRateLimit.mockResolvedValue({
      allowed: true,
      limit: 60,
      remaining: 59,
      retryAfterSeconds: 60,
    });

    const response = await getMutationRateLimitResponse(
      new Request("http://localhost/api/deals", {
        method: "POST",
        headers: { "x-forwarded-for": "203.0.113.10" },
      }),
    );

    expect(response).toBeNull();
    expect(consumeMutationRateLimit).toHaveBeenCalledWith(
      expect.objectContaining({
        scopePrefix: "mutation",
        clientKey: expect.stringMatching(/^[a-f0-9]{64}$/),
        clientLimit: 60,
        globalLimit: 600,
        windowSeconds: 60,
      }),
    );
  });

  it("returns a standardized 429 response with retry metadata", async () => {
    consumeMutationRateLimit.mockResolvedValue({
      allowed: false,
      limit: 60,
      remaining: 0,
      retryAfterSeconds: 42,
    });

    const response = await getMutationRateLimitResponse(
      new Request("http://localhost/api/deals", { method: "POST" }),
    );

    expect(response?.status).toBe(429);
    expect(response?.headers.get("retry-after")).toBe("42");
    expect(response?.headers.get("ratelimit-limit")).toBe("60");
    await expect(response?.json()).resolves.toEqual({
      message: "Too many mutation requests. Try again shortly.",
    });
  });
});
