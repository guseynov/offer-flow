import { cva } from "class-variance-authority";
import clsx from "clsx";
import type { MetricCardProps } from "@/types/dashboard";

const metricIconVariants = cva(
  "grid size-11 shrink-0 place-items-center rounded-xl text-lg font-bold ring-1",
  {
    variants: {
      accent: {
        amber: "bg-amber-50 text-amber-700 ring-amber-100",
        emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        rose: "bg-rose-50 text-rose-700 ring-rose-100",
        blue: "bg-blue-50 text-blue-700 ring-blue-100",
        violet: "bg-violet-50 text-violet-700 ring-violet-100",
      },
    },
  },
);

export function MetricCard({
  label,
  value,
  helper,
  icon,
  accent,
}: MetricCardProps) {
  return (
    <article
      className={clsx(
        "rounded-2xl border border-slate-200/80 bg-white p-5",
        "shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition duration-200",
        "hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)] sm:p-6",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <span className={metricIconVariants({ accent })}>{icon}</span>
      </div>
      <p className="mt-5 border-t border-slate-100 pt-4 text-xs font-medium text-slate-400">
        {helper}
      </p>
    </article>
  );
}
