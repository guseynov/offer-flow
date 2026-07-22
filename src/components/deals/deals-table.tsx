"use client";

import { cva } from "class-variance-authority";
import Link from "next/link";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboardUiStore } from "@/stores/dashboard-ui-store";
import type { DealsTableProps } from "@/types/deal";

const columns = [
  "Offer",
  "Category",
  "Partner",
  "Value",
  "Status",
  "Window",
  "Updated",
  "Actions",
];

const headerCellVariants = cva(
  "px-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-(--text-faint) first:pl-6 last:pr-6",
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

export function DealsTable({ deals }: DealsTableProps) {
  const tableDensity = useDashboardUiStore((state) => state.tableDensity);

  return (
    <div className="ui-data-grid overflow-hidden rounded-[0.9rem]">
      <div className="overflow-x-auto">
        <Table className="w-full min-w-280 border-collapse text-left">
          <TableHeader>
            <TableRow className="border-b border-(--surface-overlay-strong) bg-(--surface-overlay) hover:bg-(--surface-overlay)">
              {columns.map((column) => (
                <TableHead
                  key={column}
                  className={headerCellVariants({ density: tableDensity })}
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-(--surface-overlay-strong)">
            {deals.map((deal) => (
              <TableRow key={deal.id} className="ui-table-row">
                <TableCell
                  className={bodyCellVariants({
                    density: tableDensity,
                    className: "max-w-64 pl-6",
                  })}
                >
                  <p className="truncate text-sm font-semibold text-(--text-strong)">
                    {deal.title}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-(--text-faint)">
                    {deal.id}
                  </p>
                </TableCell>
                <TableCell
                  className={bodyCellVariants({
                    density: tableDensity,
                    className: "whitespace-nowrap text-sm text-(--text-soft)",
                  })}
                >
                  {deal.categoryLabel}
                </TableCell>
                <TableCell
                  className={bodyCellVariants({
                    density: tableDensity,
                    className: "max-w-48 text-sm text-(--text-soft)",
                  })}
                >
                  <span className="line-clamp-2">{deal.partnerName}</span>
                </TableCell>
                <TableCell
                  className={bodyCellVariants({
                    density: tableDensity,
                    className:
                      "whitespace-nowrap text-sm font-semibold tabular-nums text-(--text-strong)",
                  })}
                >
                  {deal.formattedPrice}
                </TableCell>
                <TableCell
                  className={bodyCellVariants({
                    density: tableDensity,
                    className: "whitespace-nowrap",
                  })}
                >
                  <StatusBadge status={deal.status} />
                </TableCell>
                <TableCell
                  className={bodyCellVariants({
                    density: tableDensity,
                    className: "whitespace-nowrap text-sm text-(--text-soft)",
                  })}
                >
                  {deal.dateRangeLabel}
                </TableCell>
                <TableCell
                  className={bodyCellVariants({
                    density: tableDensity,
                    className: "whitespace-nowrap text-sm text-(--text-faint)",
                  })}
                >
                  {deal.updatedAtLabel}
                </TableCell>
                <TableCell
                  className={bodyCellVariants({
                    density: tableDensity,
                    className: "pr-6",
                  })}
                >
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-auto px-0 py-0 text-sm font-semibold text-primary hover:bg-transparent hover:text-(--text-strong)"
                  >
                    <Link href={`/dashboard/deals/${deal.id}`}>Review offer</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
