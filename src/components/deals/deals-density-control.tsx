"use client";

import { Button } from "@/components/ui/button";
import { useDashboardUiStore } from "@/stores/dashboard-ui-store";
import type { DensityOption, TableDensity } from "@/types/ui";

const densityOptions: DensityOption[] = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
];

function isDensityActive(current: TableDensity, option: TableDensity) {
  return current === option;
}

export function DealsDensityControl() {
  const tableDensity = useDashboardUiStore((state) => state.tableDensity);
  const setTableDensity = useDashboardUiStore((state) => state.setTableDensity);

  return (
    <div className="flex items-center justify-between gap-3 pb-3">
      <p className="ui-label">View density</p>
      <div
        role="group"
        aria-label="Table density"
        className="surface-panel-soft inline-flex rounded-xl p-1 gap-2"
      >
        {densityOptions.map((option) => {
          const isActive = isDensityActive(tableDensity, option.value);

          return (
            <Button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => setTableDensity(option.value)}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className={
                isActive
                  ? "bg-surface text-(--text-strong) ring-1 ring-inset ring-(--surface-overlay-strong)"
                  : "text-(--text-faint)"
              }
            >
              {option.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
