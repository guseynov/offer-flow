"use client";

import { cva } from "class-variance-authority";
import Link from "next/link";
import { useDashboardUiStore } from "@/stores/dashboard-ui-store";
import type { DealsTableProps } from "@/types/deal";
import { StatusBadge } from "@/components/dashboard/status-badge";

const columns = [
  "Title",
  "Category",
  "Partner",
  "Price",
  "Status",
  "Date range",
  "Last updated",
  "Actions",
];

const headerCellVariants = cva(
  "px-5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 first:pl-6 last:pr-6",
  {
    variants: {
      density: {
        comfortable: "py-3.5",
        compact: "py-2.5",
      },
    },
  },
);

const bodyCellVariants = cva("px-5", {
  variants: {
    density: {
      comfortable: "py-4",
      compact: "py-2.5",
    },
  },
});

function getDealCountLabel(count: number) {
  if (count === 1) {
    return "deal";
  }

  return "deals";
}

export function DealsTable({ deals }: DealsTableProps) {
  const tableDensity = useDashboardUiStore((state) => state.tableDensity);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className={headerCellVariants({ density: tableDensity })}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deals.map((deal) => (
              <tr key={deal.id} className="transition-colors hover:bg-emerald-50/30">
                <td className={bodyCellVariants({ density: tableDensity, className: "max-w-64 pl-6" })}>
                  <p className="truncate text-sm font-semibold text-slate-900">{deal.title}</p>
                  <p className="mt-1 font-mono text-[11px] text-slate-400">{deal.id}</p>
                </td>
                <td className={bodyCellVariants({ density: tableDensity, className: "whitespace-nowrap text-sm text-slate-600" })}>
                  {deal.categoryLabel}
                </td>
                <td className={bodyCellVariants({ density: tableDensity, className: "max-w-48 text-sm text-slate-600" })}>
                  <span className="line-clamp-2">{deal.partnerName}</span>
                </td>
                <td className={bodyCellVariants({ density: tableDensity, className: "whitespace-nowrap text-sm font-semibold tabular-nums text-slate-800" })}>
                  {deal.formattedPrice}
                </td>
                <td className={bodyCellVariants({ density: tableDensity, className: "whitespace-nowrap" })}>
                  <StatusBadge status={deal.status} />
                </td>
                <td className={bodyCellVariants({ density: tableDensity, className: "whitespace-nowrap text-sm text-slate-600" })}>
                  {deal.dateRangeLabel}
                </td>
                <td className={bodyCellVariants({ density: tableDensity, className: "whitespace-nowrap text-sm text-slate-500" })}>
                  {deal.updatedAtLabel}
                </td>
                <td className={bodyCellVariants({ density: tableDensity, className: "pr-6" })}>
                  <Link
                    href={`/dashboard/deals/${deal.id}`}
                    className="whitespace-nowrap text-sm font-semibold text-emerald-700 underline-offset-4 hover:text-emerald-900 hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
                  >
                    View details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-3 text-xs font-medium text-slate-500">
        Showing {deals.length} {getDealCountLabel(deals.length)}
      </div>
    </div>
  );
}
