"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

type OverviewChartPoint = {
  month: string;
  approved: number;
  pending: number;
  rejected: number;
};

type OverviewChartProps = {
  series: OverviewChartPoint[];
};

type OverviewChartTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: OverviewChartPoint }>;
};

const CHART_MAX = 20;

function getTotal(point: OverviewChartPoint) {
  return point.approved + point.pending + point.rejected;
}

function OverviewChartTooltip({ active, payload }: OverviewChartTooltipProps) {
  const point = payload?.[0]?.payload;

  if (!active || !point) {
    return null;
  }

  return (
    <div className="w-44 rounded-xl border border-(--surface-overlay-strong) bg-(--surface-popover) px-3 py-2 text-left shadow-(--shadow-lg) backdrop-blur">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--text-faint)">
          {point.month}
        </p>
        <p className="text-sm font-semibold text-(--text-strong)">
          {getTotal(point)} total
        </p>
      </div>
      <div className="mt-2 space-y-1.5 text-xs">
        <p className="flex items-center justify-between gap-4 text-(--text-soft)">
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-sm bg-success" />
            approved
          </span>
          <span>{point.approved}</span>
        </p>
        <p className="flex items-center justify-between gap-4 text-(--text-soft)">
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-sm bg-warning" />
            pending
          </span>
          <span>{point.pending}</span>
        </p>
        <p className="flex items-center justify-between gap-4 text-(--text-soft)">
          <span className="inline-flex items-center gap-2">
            <span className="size-2 rounded-sm bg-danger" />
            rejected
          </span>
          <span>{point.rejected}</span>
        </p>
      </div>
    </div>
  );
}

export function OverviewChart({ series }: OverviewChartProps) {
  const [activeMonth, setActiveMonth] = useState<string | null>(null);

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={series}
          margin={{ top: 10, right: 16, bottom: 10, left: 12 }}
          onMouseMove={(state) => {
            setActiveMonth(
              typeof state?.activeLabel === "string" ? state.activeLabel : null,
            );
          }}
          onMouseLeave={() => setActiveMonth(null)}
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--surface-overlay)"
            strokeDasharray="3 7"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tickMargin={14}
            tick={({ x, y, payload }) => {
              const isActive = payload.value === activeMonth;

              return (
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  className={cn(
                    "fill-(--text-faint) text-xs transition-colors",
                    isActive && "fill-(--text-soft)",
                  )}
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <YAxis
            domain={[0, CHART_MAX]}
            ticks={[0, 5, 10, 15, 20]}
            axisLine={false}
            tickLine={false}
            tickMargin={12}
            width={40}
            tick={{ fill: "var(--text-faint)", fontSize: 12 }}
          />
          <Tooltip
            cursor={{
              stroke: "var(--surface-overlay-strong)",
              strokeDasharray: "4 6",
            }}
            content={<OverviewChartTooltip />}
            wrapperStyle={{ outline: "none" }}
          />
          <Line
            type="linear"
            dataKey="rejected"
            stroke="var(--danger)"
            strokeWidth={4}
            dot={{
              r: 4,
              fill: "var(--danger)",
              stroke: "var(--surface)",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: "var(--danger)",
              stroke: "var(--surface)",
              strokeWidth: 3,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
