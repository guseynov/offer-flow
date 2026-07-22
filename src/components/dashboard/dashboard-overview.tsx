"use client";

import { useQuery } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDashboardData } from "@/lib/api/dashboard";
import { mapDealDtosToDeals } from "@/lib/mappers/deal";
import { dealKeys } from "@/lib/query-keys";
import { OverviewChart } from "./overview-chart";
import type { DashboardDataDto } from "@/lib/dashboard-data";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function DashboardOverviewSkeleton() {
  return (
    <div aria-label="Loading dashboard" aria-live="polite" className="space-y-5">
      <div className="space-y-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.55fr)]">
        <Skeleton className="h-80 rounded-lg" />
        <Skeleton className="h-80 rounded-lg" />
      </div>
      <span className="sr-only">Loading dashboard…</span>
    </div>
  );
}

export function DashboardOverview({ initialData }: { initialData?: DashboardDataDto }) {
  const dealsQuery = useQuery({
    queryKey: dealKeys.dashboard,
    queryFn: getDashboardData,
    initialData,
  });

  if (dealsQuery.isPending) {
    return <DashboardOverviewSkeleton />;
  }

  if (dealsQuery.isError) {
    return (
      <div role="alert" className="surface-panel-danger rounded-lg px-6 py-12 text-center">
        <h1 className="text-xl font-bold text-(--text-strong)">
          Dashboard data could not be loaded
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-(--text-soft)">
          The offers request failed or returned an invalid response.
        </p>
        <Button
          type="button"
          variant="danger"
          onClick={() => void dealsQuery.refetch()}
          className="mt-6"
        >
          <RefreshCw size={14} />
          retry
        </Button>
      </div>
    );
  }

  const summary = dealsQuery.data.summary;
  const statusSeries = dealsQuery.data.statusSeries;
  const pendingDeals = mapDealDtosToDeals(dealsQuery.data.pendingDeals);
  const recentDeals = mapDealDtosToDeals(dealsQuery.data.recentDeals);

  const snapshotRows = [
    { label: "Total offers", value: summary.total },
    { label: "Draft", value: summary.draft },
    { label: "Pending review", value: summary.pending },
    { label: "Approved", value: summary.approved },
    { label: "Rejected", value: summary.rejected },
  ];

  return (
    <div className="mx-auto max-w-[1750px] space-y-5">
      <header className="border-b border-(--surface-overlay-strong) pb-5">
        <h1 className="text-[2rem] font-bold tracking-[-0.035em] text-(--text-strong)">
          dashboard
        </h1>
        <p className="mt-1 text-sm text-(--text-muted)">
          {summary.total} offers · {summary.pending} pending review
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.55fr)]">
        <Card className="min-w-0 p-4">
          <CardHeader className="flex-row items-center justify-between border-b border-(--surface-overlay-strong) p-0 pb-3">
            <div>
              <h2 className="text-base font-bold text-(--text-strong)">
                Pending review
              </h2>
              <p className="mt-1 text-xs text-(--text-muted)">
                Offers currently waiting for a decision
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link href="/dashboard/deals?status=pending">view all →</Link>
            </Button>
          </CardHeader>
          <CardContent className="mt-4 overflow-x-auto p-0">
            {pendingDeals.length === 0 ? (
              <p className="py-12 text-center text-sm text-(--text-muted)">
                No offers are waiting for review.
              </p>
            ) : (
              <Table className="min-w-190 border-collapse text-left">
                <TableHeader>
                  <TableRow className="border-(--surface-overlay)">
                    <TableHead>Offer</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Window</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell>
                        <p className="text-sm font-semibold text-(--text-strong)">
                          {deal.title}
                        </p>
                        <p className="mt-1 text-xs text-(--text-muted)">
                          {deal.id}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm text-(--text-soft)">
                        {deal.partnerName}
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold text-(--text-strong)">
                        {deal.formattedPrice}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-(--text-soft)">
                        {deal.dateRangeLabel}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-primary"
                        >
                          <Link href={`/dashboard/deals/${deal.id}`}>review</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="min-w-0 p-4">
          <CardHeader className="border-b border-(--surface-overlay-strong) p-0 pb-3">
            <h2 className="text-base font-bold text-(--text-strong)">
              Queue snapshot
            </h2>
            <p className="text-xs text-(--text-muted)">
              Current records from the offers API
            </p>
          </CardHeader>
          <CardContent className="mt-2 p-0">
            <dl className="divide-y divide-(--surface-overlay-strong)">
              {snapshotRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <dt className="text-sm text-(--text-soft)">{row.label}</dt>
                  <dd className="text-sm font-bold tabular-nums text-(--text-strong)">
                    {row.value}
                  </dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-sm text-(--text-soft)">Approved value</dt>
                <dd className="text-sm font-bold tabular-nums text-success">
                  {currencyFormatter.format(summary.approvedValueCents / 100)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.55fr)]">
        <Card className="min-w-0 p-4">
          <CardHeader className="border-b border-(--surface-overlay-strong) p-0 pb-3">
            <h2 className="text-base font-bold text-(--text-strong)">
              Current status distribution
            </h2>
            <p className="text-xs text-(--text-muted)">
              Every offer counted once by its current workflow state
            </p>
          </CardHeader>
          <CardContent className="mt-5 p-0">
            <OverviewChart series={statusSeries} />
          </CardContent>
        </Card>

        <Card className="min-w-0 p-4">
          <CardHeader className="border-b border-(--surface-overlay-strong) p-0 pb-3">
            <h2 className="text-base font-bold text-(--text-strong)">
              Recent updates
            </h2>
            <p className="text-xs text-(--text-muted)">
              Most recently changed offer records
            </p>
          </CardHeader>
          <CardContent className="mt-4 space-y-4 p-0">
            {recentDeals.map((deal) => (
              <div
                key={deal.id}
                className="flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <Link
                    href={`/dashboard/deals/${deal.id}`}
                    className="block truncate text-sm font-semibold text-(--text-strong) hover:text-primary"
                  >
                    {deal.title}
                  </Link>
                  <p className="mt-1 text-xs text-(--text-muted)">
                    {deal.partnerName} · {deal.updatedAtLabel}
                  </p>
                </div>
                <StatusBadge status={deal.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
