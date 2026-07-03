import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { DealDetailErrorProps } from "@/types/deal";

export function DealDetailError({ onRetry }: DealDetailErrorProps) {
  return (
    <div role="alert" className="surface-panel-danger rounded-[0.9rem] px-6 py-14 text-center">
      <span
        aria-hidden="true"
        className="mx-auto grid size-12 place-items-center rounded-xl border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] bg-danger-soft text-danger"
      >
        <AlertTriangle size={18} strokeWidth={2.25} />
      </span>
      <h1 className="mt-4 text-xl font-bold text-(--text-strong)">
        Offer could not be loaded
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-(--text-soft)">
        This offer may not exist, or the API response could not be validated.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button type="button" variant="danger" onClick={onRetry}>
          <RefreshCw size={14} />
          retry
        </Button>
        <Button asChild variant="secondary">
          <Link href="/dashboard/deals">back to offers</Link>
        </Button>
      </div>
    </div>
  );
}
