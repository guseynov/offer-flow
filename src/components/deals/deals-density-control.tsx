"use client";

import { cva } from "class-variance-authority";
import { useDashboardUiStore } from "@/stores/dashboard-ui-store";
import type { DensityOption, TableDensity } from "@/types/ui";

const densityOptions: DensityOption[] = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
];

const densityButtonVariants = cva(
  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600",
  {
    variants: {
      active: {
        true: "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200",
        false: "text-slate-500 hover:text-slate-800",
      },
    },
    defaultVariants: { active: false },
  },
);

function isDensityActive(current: TableDensity, option: TableDensity) {
  return current === option;
}

export function DealsDensityControl() {
  const tableDensity = useDashboardUiStore((state) => state.tableDensity);
  const setTableDensity = useDashboardUiStore(
    (state) => state.setTableDensity,
  );

  return (
    <div className="flex items-center justify-between gap-3 pb-3">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
        Table density
      </p>
      <div
        role="group"
        aria-label="Table density"
        className="inline-flex rounded-xl bg-slate-100 p-1"
      >
        {densityOptions.map((option) => {
          const isActive = isDensityActive(tableDensity, option.value);

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => setTableDensity(option.value)}
              className={densityButtonVariants({ active: isActive })}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
