import { describe, expect, it } from "vitest";
import {
  getDashboardStatusSeries,
  getDashboardSummary,
  getPendingDeals,
  getRecentDeals,
} from "@/lib/dashboard-data";
import { mockDeals } from "@/mocks/deals";

describe("dashboard data", () => {
  it("derives every summary value from the offer records", () => {
    expect(getDashboardSummary(mockDeals)).toEqual({
      total: 50,
      draft: 12,
      pending: 13,
      approved: 13,
      rejected: 12,
      approvedValueCents: 79450,
    });
  });

  it("includes every workflow status in the chart", () => {
    expect(getDashboardStatusSeries(mockDeals)).toEqual([
      { status: "draft", label: "Draft", count: 12 },
      { status: "pending", label: "Pending", count: 13 },
      { status: "approved", label: "Approved", count: 13 },
      { status: "rejected", label: "Rejected", count: 12 },
    ]);
  });

  it("builds pending and recent queues from updated timestamps", () => {
    const pendingDeals = getPendingDeals(mockDeals);

    expect(pendingDeals).toHaveLength(13);
    expect(pendingDeals.every((deal) => deal.status === "pending")).toBe(true);
    expect(pendingDeals.slice(0, 2).map((deal) => deal.id)).toEqual([
      "deal-048",
      "deal-044",
    ]);
    expect(getRecentDeals(mockDeals, 3).map((deal) => deal.id)).toEqual([
      "deal-050",
      "deal-049",
      "deal-048",
    ]);
  });
});
