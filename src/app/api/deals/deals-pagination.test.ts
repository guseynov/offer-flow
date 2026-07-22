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
  it("returns bounded numbered pages with navigation metadata", async () => {
    const firstResponse = await requestDeals("?page=1&limit=2");
    const firstPage = (await firstResponse.json()) as DealsResponseDto;

    expect(firstResponse.status).toBe(200);
    expect(firstPage.data).toHaveLength(2);
    expect(firstPage.pageInfo.total).toBeGreaterThanOrEqual(50);
    expect(firstPage.pageInfo.page).toBe(1);
    expect(firstPage.pageInfo.pageSize).toBe(2);
    expect(firstPage.pageInfo.hasPreviousPage).toBe(false);
    expect(firstPage.pageInfo.hasNextPage).toBe(true);

    const secondResponse = await requestDeals("?page=2&limit=2");
    const secondPage = (await secondResponse.json()) as DealsResponseDto;

    expect(secondResponse.status).toBe(200);
    expect(secondPage.data).toHaveLength(2);
    expect(secondPage.pageInfo.page).toBe(2);
    expect(secondPage.pageInfo.hasPreviousPage).toBe(true);
    expect(secondPage.data.map((deal) => deal.id)).not.toEqual(
      firstPage.data.map((deal) => deal.id),
    );
  });

  it("filters by partner on the server", async () => {
    const response = await requestDeals("?q=Northstar&limit=20");
    const page = (await response.json()) as DealsResponseDto;

    expect(response.status).toBe(200);
    expect(page.pageInfo.total).toBeGreaterThan(1);
    expect(page.data.every((deal) => deal.partnerName === "Northstar Roasters")).toBe(
      true,
    );
  });

  it("rejects invalid limits and page numbers", async () => {
    const invalidLimit = await requestDeals("?limit=101");
    const invalidPage = await requestDeals("?page=0");
    const nonNumericPage = await requestDeals("?page=next");

    expect(invalidLimit.status).toBe(400);
    expect(invalidPage.status).toBe(400);
    expect(nonNumericPage.status).toBe(400);
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
