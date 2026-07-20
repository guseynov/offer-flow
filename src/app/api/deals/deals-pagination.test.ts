// @vitest-environment node

import { describe, expect, it } from "vitest";
import { GET as getDashboard } from "@/app/api/dashboard/route";
import { GET as getDeals } from "@/app/api/deals/route";
import type { DashboardDataDto } from "@/lib/dashboard-data";
import type { DealsResponseDto } from "@/types/deal";

async function requestDeals(query = "") {
  return getDeals(new Request(`http://localhost/api/deals${query}`));
}

describe("deals pagination", () => {
  it("returns a bounded page with a continuation cursor", async () => {
    const firstResponse = await requestDeals("?limit=2");
    const firstPage = (await firstResponse.json()) as DealsResponseDto;

    expect(firstResponse.status).toBe(200);
    expect(firstPage.data).toHaveLength(2);
    expect(firstPage.pageInfo.total).toBeGreaterThanOrEqual(6);
    expect(firstPage.pageInfo.hasNextPage).toBe(true);
    expect(firstPage.pageInfo.nextCursor).toBeTruthy();

    const secondResponse = await requestDeals(
      `?limit=2&cursor=${encodeURIComponent(firstPage.pageInfo.nextCursor ?? "")}`,
    );
    const secondPage = (await secondResponse.json()) as DealsResponseDto;

    expect(secondResponse.status).toBe(200);
    expect(secondPage.data).toHaveLength(2);
    expect(secondPage.data.map((deal) => deal.id)).not.toEqual(
      firstPage.data.map((deal) => deal.id),
    );
  });

  it("filters by partner on the server", async () => {
    const response = await requestDeals("?q=Northstar&limit=20");
    const page = (await response.json()) as DealsResponseDto;

    expect(response.status).toBe(200);
    expect(page.pageInfo.total).toBe(1);
    expect(page.data[0]?.partnerName).toBe("Northstar Roasters");
  });

  it("rejects invalid limits and cursors", async () => {
    const invalidLimit = await requestDeals("?limit=101");
    const invalidCursor = await requestDeals("?cursor=missing-record");

    expect(invalidLimit.status).toBe(400);
    expect(invalidCursor.status).toBe(400);
  });

  it("serves complete dashboard aggregates without exposing every record", async () => {
    const response = await getDashboard();
    const dashboard = (await response.json()) as DashboardDataDto;
    const statusTotal = dashboard.statusSeries.reduce(
      (total, point) => total + point.count,
      0,
    );

    expect(response.status).toBe(200);
    expect(statusTotal).toBe(dashboard.summary.total);
    expect(dashboard.pendingDeals.length).toBeLessThanOrEqual(5);
    expect(dashboard.recentDeals.length).toBeLessThanOrEqual(5);
  });
});
