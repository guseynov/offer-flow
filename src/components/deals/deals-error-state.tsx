import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DealsErrorStateProps } from "@/types/deal";

export function DealsErrorState({ onRetry }: DealsErrorStateProps) {
  return (
    <div role="alert" className="surface-panel-danger rounded-[0.9rem] px-6 py-12 text-center">
      <span
        aria-hidden="true"
        className="mx-auto grid size-12 place-items-center rounded-xl border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] bg-danger-soft text-danger"
      >
        <AlertTriangle size={18} strokeWidth={2.25} />
      </span>
      <h2 className="mt-4 text-xl font-bold text-(--text-strong)">
        Offers could not be loaded
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-(--text-soft)">
        The API request failed or returned an invalid response. Try the request again.
      </p>
      <Button type="button" variant="danger" onClick={onRetry} className="mt-6">
        <RefreshCw size={14} />
        retry
      </Button>
    </div>
  );
}
