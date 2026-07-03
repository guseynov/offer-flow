import { Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DealsEmptyStateProps } from "@/types/deal";

export function DealsEmptyState({
  hasActiveFilters,
  onClearFilters,
}: DealsEmptyStateProps) {
  let title = "No offers yet";
  let description = "Offers returned by the internal operations API will appear here.";

  if (hasActiveFilters) {
    title = "No offers match these filters";
    description = "Adjust or clear the active filters to bring more partner offers back into view.";
  }

  return (
    <div className="surface-panel rounded-[0.9rem] px-6 py-16 text-center">
      <span
        aria-hidden="true"
        className="mx-auto grid size-14 place-items-center rounded-xl border border-[color-mix(in_srgb,var(--primary)_32%,transparent)] bg-primary-soft text-primary"
      >
        <Package2 size={20} strokeWidth={2} />
      </span>
      <h2 className="mt-5 text-xl font-bold text-(--text-strong)">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-(--text-muted)">
        {description}
      </p>
      {hasActiveFilters && (
        <Button
          type="button"
          variant="secondary"
          onClick={onClearFilters}
          className="mt-6"
        >
          clear filters
        </Button>
      )}
    </div>
  );
}
