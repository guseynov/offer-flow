import type { DealsEmptyStateProps } from "@/types/deal";

export function DealsEmptyState({
  hasActiveFilters,
  onClearFilters,
}: DealsEmptyStateProps) {
  let title = "No deals yet";
  let description = "Deals returned by the operations API will appear here.";

  if (hasActiveFilters) {
    title = "No deals match these filters";
    description = "Adjust or clear the active filters to see more results.";
  }

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <span
        aria-hidden="true"
        className="mx-auto grid size-12 place-items-center rounded-xl bg-slate-100 text-xl text-slate-500"
      >
        ◇
      </span>
      <h2 className="mt-4 text-lg font-bold text-slate-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
