import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DealsResponseDto } from "@/types/deal";

type DealsPaginationProps = {
  pageInfo: DealsResponseDto["pageInfo"];
  disabled: boolean;
  onPageChange: (page: number) => void;
};

function getOfferCountLabel(count: number) {
  return count === 1 ? "offer" : "offers";
}

export function DealsPagination({
  pageInfo,
  disabled,
  onPageChange,
}: DealsPaginationProps) {
  const firstResult = (pageInfo.page - 1) * pageInfo.pageSize + 1;
  const lastResult = Math.min(
    pageInfo.page * pageInfo.pageSize,
    pageInfo.total,
  );

  return (
    <nav
      aria-label="Offers pagination"
      className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p
        aria-live="polite"
        className="text-xs font-medium text-(--text-faint)"
      >
        Showing {firstResult}–{lastResult} of {pageInfo.total}{" "}
        {getOfferCountLabel(pageInfo.total)} · Page {pageInfo.page} of{" "}
        {pageInfo.totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled || !pageInfo.hasPreviousPage}
          onClick={() => onPageChange(pageInfo.page - 1)}
        >
          <ChevronLeft aria-hidden="true" size={14} />
          Previous
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled || !pageInfo.hasNextPage}
          onClick={() => onPageChange(pageInfo.page + 1)}
        >
          Next
          <ChevronRight aria-hidden="true" size={14} />
        </Button>
      </div>
    </nav>
  );
}
