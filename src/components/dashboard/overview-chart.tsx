import type { CSSProperties } from "react";
import type { DashboardStatusPoint } from "@/lib/dashboard-data";
import type { DealStatus } from "@/types/deal";

type OverviewChartProps = {
  series: DashboardStatusPoint[];
};

const statusColors: Record<DealStatus, string> = {
  draft: "var(--text-faint)",
  pending: "var(--warning)",
  approved: "var(--success)",
  rejected: "var(--danger)",
};

export function OverviewChart({ series }: OverviewChartProps) {
  const maximum = Math.max(1, ...series.map((point) => point.count));

  return (
    <figure>
      <ul
        aria-label="Current offer status distribution"
        className="grid h-64 grid-cols-4 items-end gap-3 border-b border-(--surface-overlay-strong) px-2 pt-7 sm:gap-6"
      >
        {series.map((point) => {
          const height = Math.max(4, (point.count / maximum) * 100);
          const style = {
            "--bar-height": `${height}%`,
            "--bar-color": statusColors[point.status],
          } as CSSProperties;

          return (
            <li key={point.status} className="flex h-full min-w-0 flex-col justify-end text-center">
              <span className="mb-2 text-sm font-bold tabular-nums text-(--text-strong)">
                {point.count}
                <span className="sr-only"> offers</span>
              </span>
              <span
                aria-hidden="true"
                style={style}
                className="mx-auto h-(--bar-height) w-full max-w-16 rounded-t-md bg-(--bar-color) motion-safe:transition-[height]"
              />
              <span className="mt-3 truncate text-xs text-(--text-muted)">
                {point.label}
              </span>
            </li>
          );
        })}
      </ul>
      <figcaption className="sr-only">
        {series.map((point) => `${point.label}: ${point.count}`).join(", ")}
      </figcaption>
    </figure>
  );
}
