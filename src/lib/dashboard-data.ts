import type { DealDto, DealStatus } from "@/types/deal";

const dashboardStatuses: Array<{ status: DealStatus; label: string }> = [
  { status: "draft", label: "Draft" },
  { status: "pending", label: "Pending" },
  { status: "approved", label: "Approved" },
  { status: "rejected", label: "Rejected" },
];

export type DashboardSummary = {
  total: number;
  draft: number;
  pending: number;
  approved: number;
  rejected: number;
  approvedValueCents: number;
};

export type DashboardStatusPoint = {
  status: DealStatus;
  label: string;
  count: number;
};

export type DashboardDataDto = {
  summary: DashboardSummary;
  statusSeries: DashboardStatusPoint[];
  pendingDeals: DealDto[];
  recentDeals: DealDto[];
};

export function getDashboardSummary(deals: DealDto[]): DashboardSummary {
  return deals.reduce<DashboardSummary>(
    (summary, deal) => {
      summary.total += 1;
      summary[deal.status] += 1;

      if (deal.status === "approved") {
        summary.approvedValueCents += deal.priceCents;
      }

      return summary;
    },
    {
      total: 0,
      draft: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      approvedValueCents: 0,
    },
  );
}

export function getDashboardStatusSeries(
  deals: DealDto[],
): DashboardStatusPoint[] {
  const summary = getDashboardSummary(deals);

  return dashboardStatuses.map(({ status, label }) => ({
    status,
    label,
    count: summary[status],
  }));
}

export function getPendingDeals(deals: DealDto[]): DealDto[] {
  return deals
    .filter((deal) => deal.status === "pending")
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function getRecentDeals(deals: DealDto[], limit = 5): DealDto[] {
  return [...deals]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, limit);
}
