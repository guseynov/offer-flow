import { categoryFilterOptions, statusFilterOptions } from "@/lib/deal-filters";
import type { DealsFiltersProps } from "@/types/deal";

export function DealsFilters({
  filters,
  onFilterChange,
  onClear,
}: DealsFiltersProps) {
  return (
    <div className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(16rem,1fr)_13rem_13rem_auto] lg:items-end">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Search deals
          </span>
          <input
            type="search"
            value={filters.query}
            onChange={(event) => onFilterChange("q", event.target.value)}
            placeholder="Search by title"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Status
          </span>
          <select
            value={filters.status ?? ""}
            onChange={(event) => onFilterChange("status", event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100"
          >
            <option value="">All statuses</option>
            {statusFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Category
          </span>
          <select
            value={filters.category ?? ""}
            onChange={(event) => onFilterChange("category", event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100"
          >
            <option value="">All categories</option>
            {categoryFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onClear}
          className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
