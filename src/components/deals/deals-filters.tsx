import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { categoryFilterOptions, statusFilterOptions } from "@/lib/deal-filters";
import type { DealsFiltersProps } from "@/types/deal";

export function DealsFilters({
  filters,
  onFilterChange,
  onClear,
}: DealsFiltersProps) {
  return (
    <div className="surface-panel mb-5 rounded-[0.9rem] p-4 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(16rem,1fr)_13rem_13rem_auto] lg:items-end">
        <label className="block">
          <Label className="mb-2 block">search</Label>
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--text-faint)"
            />
            <Input
              type="search"
              value={filters.query}
              onChange={(event) => onFilterChange("q", event.target.value)}
              placeholder="search title or partner"
              className="h-12 border-white/6 bg-surface-soft pl-10"
            />
          </div>
        </label>

        <div className="block">
          <Label className="mb-2 block">status</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) =>
              onFilterChange("status", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statusFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="block">
          <Label className="mb-2 block">category</Label>
          <Select
            value={filters.category || "all"}
            onValueChange={(value) =>
              onFilterChange("category", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categoryFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="button" variant="secondary" onClick={onClear} className="h-12">
          clear
        </Button>
      </div>
    </div>
  );
}
