import type { Metadata } from "next";
import {
  BadgeDollarSign,
  CheckCircle2,
  Clock3,
  Package2,
  PencilLine,
  Send,
  Wallet,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };

const statCards = [
  {
    label: "total_offers",
    value: "8",
    helper: "+2 this week",
    tone: "muted",
    icon: <Package2 size={24} strokeWidth={2} />,
  },
  {
    label: "pending",
    value: "3",
    helper: "needs review",
    tone: "warning",
    icon: <Clock3 size={24} strokeWidth={2} />,
  },
  {
    label: "approved_mtd",
    value: "3",
    helper: "+18% vs last mo.",
    tone: "success",
    icon: <CheckCircle2 size={24} strokeWidth={2} />,
  },
  {
    label: "rejected_mtd",
    value: "1",
    helper: "0 SLA breach",
    tone: "muted",
    icon: <XCircle size={24} strokeWidth={2} />,
  },
  {
    label: "live_value",
    value: "$150K",
    helper: "approved offers",
    tone: "primary",
    icon: <BadgeDollarSign size={24} strokeWidth={2} />,
  },
] as const;

const chartSeries = [
  { month: "Jan", approved: 4, pending: 2, rejected: 8 },
  { month: "Feb", approved: 6, pending: 3, rejected: 12 },
  { month: "Mar", approved: 5, pending: 1, rejected: 9 },
  { month: "Apr", approved: 7, pending: 3, rejected: 15 },
  { month: "May", approved: 6, pending: 2, rejected: 11 },
  { month: "Jun", approved: 8, pending: 2, rejected: 18 },
] as const;

const auditLog = [
  {
    action: "approved",
    offer: "Annual Credit Package",
    meta: "sarah.chen · Jul 01 14:32",
    tone: "success",
    icon: <CheckCircle2 size={13} strokeWidth={2.25} />,
  },
  {
    action: "created",
    offer: "Holiday Campaign 2026",
    meta: "sarah.chen · Jul 01 13:15",
    tone: "primary",
    icon: <Wallet size={13} strokeWidth={2.25} />,
  },
  {
    action: "rejected",
    offer: "Startup Bundle Q3",
    meta: "sarah.chen · Jul 01 11:48",
    tone: "danger",
    icon: <XCircle size={13} strokeWidth={2.25} />,
  },
  {
    action: "submitted",
    offer: "Enterprise Trial 90-Day",
    meta: "jamie.park · Jul 01 10:22",
    tone: "warning",
    icon: <Send size={13} strokeWidth={2.25} />,
  },
  {
    action: "edited",
    offer: "Developer Trial Bundle",
    meta: "priya.mehta · Jul 01 09:05",
    tone: "primary",
    icon: <PencilLine size={13} strokeWidth={2.25} />,
  },
  {
    action: "approved",
    offer: "API Credits Boost",
    meta: "sarah.chen · Jun 30 16:40",
    tone: "success",
    icon: <CheckCircle2 size={13} strokeWidth={2.25} />,
  },
] as const;

const pendingQueue = [
  {
    id: "OFF-002",
    title: "Developer Trial Bundle",
    value: "$12.5K",
    partner: "Twilio",
    priority: "medium",
    priorityTone: "warning",
    expires: "Jul 30",
  },
  {
    id: "OFF-005",
    title: "Enterprise Trial 90-Day",
    value: "$67.0K",
    partner: "Salesforce",
    priority: "high",
    priorityTone: "danger",
    expires: "Sep 30",
  },
  {
    id: "OFF-008",
    title: "Partner Onboarding Pack",
    value: "$8.2K",
    partner: "Segment",
    priority: "low",
    priorityTone: "muted",
    expires: "Jul 31",
  },
] as const;

function getToneClass(
  tone: "primary" | "success" | "warning" | "danger" | "muted",
) {
  if (tone === "primary") {
    return "text-primary";
  }

  if (tone === "success") {
    return "text-success";
  }

  if (tone === "warning") {
    return "text-warning";
  }

  if (tone === "danger") {
    return "text-danger";
  }

  return "text-(--text-faint)";
}

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1750px] space-y-5">
      <section className="flex flex-col gap-4 border-b border-(--surface-overlay-strong) pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[2rem] font-bold tracking-[-0.035em] text-(--text-strong)">
            dashboard
          </h1>
          <p className="mt-1 text-sm text-(--text-faint)">
            Jul 01, 2026 · 3 offers pending review
          </p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-5">
        {statCards.map((card) => (
          <Card key={card.label} className="p-4">
            <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 p-0">
              <p className="ui-label">{card.label}</p>
              <span
                className={cn(
                  "text-(--text-faint)",
                  getToneClass(card.tone),
                )}
              >
                {card.icon}
              </span>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <p className="text-[2.05rem] font-bold tracking-[-0.04em] text-(--text-strong)">
                {card.value}
              </p>
              <p className={cn("mt-1 text-sm", getToneClass(card.tone))}>
                {card.helper}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(19rem,0.9fr)]">
        <Card className="p-4">
          <CardHeader className="border-b border-(--surface-overlay-strong) p-0 pb-3">
            <p className="ui-label">offer_volume._last_6m</p>
          </CardHeader>
          <CardContent className="mt-5 p-0">
            <OverviewChart series={[...chartSeries]} />
            <div className="mt-5 flex flex-wrap gap-4 text-xs text-(--text-faint)">
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-sm bg-success" />
                approved
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-sm bg-warning" />
                pending
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-sm bg-danger" />
                rejected
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader className="border-b border-(--surface-overlay-strong) p-0 pb-3">
            <p className="ui-label">audit_log</p>
          </CardHeader>
          <CardContent className="mt-4 space-y-4 p-0">
            {auditLog.map((item) => (
              <div
                key={`${item.action}-${item.offer}`}
                className="flex items-start gap-2.5"
              >
                <span
                  className={cn("mt-0.5 shrink-0", getToneClass(item.tone))}
                >
                  {item.icon}
                </span>
                <div className="space-y-1">
                  <p className="text-sm text-(--text-strong)">
                    <span className={getToneClass(item.tone)}>
                      {item.action}
                    </span>{" "}
                    {item.offer}
                  </p>
                  <p className="text-xs text-(--text-faint)">
                    {item.meta}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card className="p-4">
        <CardHeader className="flex-row items-center justify-between border-b border-(--surface-overlay-strong) p-0 pb-3">
          <p className="ui-label">pending_queue._3_items</p>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-auto px-0 py-0 text-xs"
          >
            <Link href="/dashboard/deals">view_all →</Link>
          </Button>
        </CardHeader>
        <CardContent className="mt-4 overflow-x-auto p-0">
          <Table className="min-w-215 border-collapse text-left">
            <TableHeader>
              <TableRow className="border-(--surface-overlay)">
                <TableHead>id</TableHead>
                <TableHead>title</TableHead>
                <TableHead className="text-right">value</TableHead>
                <TableHead>partner</TableHead>
                <TableHead>priority</TableHead>
                <TableHead>expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingQueue.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-xs text-(--text-faint)">
                    {item.id}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-(--text-strong)">
                    {item.title}
                  </TableCell>
                  <TableCell className="text-right text-sm font-semibold text-primary">
                    {item.value}
                  </TableCell>
                  <TableCell className="text-sm text-(--text-muted)">
                    {item.partner}
                  </TableCell>
                  <TableCell
                    className={cn("text-sm", getToneClass(item.priorityTone))}
                  >
                    <Badge
                      variant={
                        item.priorityTone === "danger"
                          ? "danger"
                          : item.priorityTone === "warning"
                            ? "warning"
                            : "muted"
                      }
                      className="w-fit lowercase"
                    >
                      {item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-(--text-faint)">
                    {item.expires}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
