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
      total: 6,
      draft: 1,
      pending: 2,
      approved: 2,
      rejected: 1,
      approvedValueCents: 9600,
    });
  });

  it("includes every workflow status in the chart", () => {
    expect(getDashboardStatusSeries(mockDeals)).toEqual([
      { status: "draft", label: "Draft", count: 1 },
      { status: "pending", label: "Pending", count: 2 },
      { status: "approved", label: "Approved", count: 2 },
      { status: "rejected", label: "Rejected", count: 1 },
    ]);
  });

  it("builds pending and recent queues from updated timestamps", () => {
    expect(getPendingDeals(mockDeals).map((deal) => deal.id)).toEqual([
      "deal-002",
      "deal-006",
    ]);
    expect(getRecentDeals(mockDeals, 3).map((deal) => deal.id)).toEqual([
      "deal-001",
      "deal-002",
      "deal-003",
    ]);
  });
});
