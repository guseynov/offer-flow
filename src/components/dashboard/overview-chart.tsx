"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardStatusPoint } from "@/lib/dashboard-data";
import type { DealStatus } from "@/types/deal";

type OverviewChartProps = {
  series: DashboardStatusPoint[];
};

type OverviewChartTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: DashboardStatusPoint }>;
};

const statusColors: Record<DealStatus, string> = {
  draft: "var(--text-faint)",
  pending: "var(--warning)",
  approved: "var(--success)",
  rejected: "var(--danger)",
};

function OverviewChartTooltip({ active, payload }: OverviewChartTooltipProps) {
  const point = payload?.[0]?.payload;

  if (!active || !point) {
    return null;
  }

  return (
    <div className="rounded-lg border border-(--surface-overlay-strong) bg-(--surface-popover) px-3 py-2 text-sm shadow-(--shadow-sm)">
      <p className="font-semibold text-(--text-strong)">{point.label}</p>
      <p className="mt-1 text-(--text-muted)">
        {point.count} {point.count === 1 ? "offer" : "offers"}
      </p>
    </div>
  );
}

export function OverviewChart({ series }: OverviewChartProps) {
  const accessibleSummary = series
    .map((point) => `${point.label}: ${point.count}`)
    .join(", ");

  return (
    <figure>
      <div
        role="img"
        aria-label={`Current offer status distribution. ${accessibleSummary}.`}
        className="h-64 w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={series}
            margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--surface-overlay-strong)"
              strokeDasharray="3 7"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              width={28}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "var(--surface-overlay)" }}
              content={<OverviewChartTooltip />}
              wrapperStyle={{ outline: "none" }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={64}>
              {series.map((point) => (
                <Cell
                  key={point.status}
                  fill={statusColors[point.status]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="sr-only">{accessibleSummary}</figcaption>
    </figure>
  );
}
