import { cva } from "class-variance-authority";
import type { StatusBadgeProps } from "@/types/dashboard";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset",
  {
    variants: {
      status: {
        pending: "bg-amber-50 text-amber-700 ring-amber-200",
        approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        rejected: "bg-rose-50 text-rose-700 ring-rose-200",
        draft: "bg-slate-100 text-slate-600 ring-slate-200",
      },
    },
  },
);

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={statusBadgeVariants({ status })}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
