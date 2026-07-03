"use client";

import { Check, Loader2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { setDealDecision } from "@/lib/api/deals";
import { dealKeys } from "@/lib/query-keys";
import type {
  DealDecision,
  DealStatus,
  DealStatusActionsProps,
} from "@/types/deal";

function isDecisionDisabled(
  currentStatus: DealStatus,
  decision: DealDecision,
  isPending: boolean,
) {
  if (isPending) {
    return true;
  }

  return currentStatus === decision;
}

function getPendingDecision(
  isPending: boolean,
  decision: DealDecision | undefined,
) {
  if (isPending) {
    return decision;
  }

  return undefined;
}

function getActionLabel(action: DealDecision, pendingDecision: DealDecision | undefined) {
  if (action === pendingDecision && action === "approved") {
    return "Approving…";
  }

  if (action === pendingDecision && action === "rejected") {
    return "Rejecting…";
  }

  if (action === "approved") {
    return "Approve";
  }

  return "Reject";
}

export function DealStatusActions({ dealId, status }: DealStatusActionsProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (decision: DealDecision) => setDealDecision(dealId, decision),
    onSuccess: (updatedDeal) => {
      queryClient.setQueryData(dealKeys.detail(dealId), updatedDeal);
      void queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) });
      void queryClient.invalidateQueries({ queryKey: dealKeys.all });
    },
  });

  const pendingDecision = getPendingDecision(
    mutation.isPending,
    mutation.variables,
  );
  const showApprove = status === "draft" || status === "pending" || status === "rejected";
  const showReject = status === "draft" || status === "pending" || status === "approved";

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {showApprove ? (
          <Button
            disabled={isDecisionDisabled(status, "approved", mutation.isPending)}
            onClick={() => mutation.mutate("approved")}
            variant="success"
            className="min-h-11 min-w-32"
          >
            {pendingDecision === "approved" ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Check size={14} />
            )}
            {status === "rejected" ? "Approve again" : getActionLabel("approved", pendingDecision)}
          </Button>
        ) : null}

        {showReject ? (
          <Button
            disabled={isDecisionDisabled(status, "rejected", mutation.isPending)}
            onClick={() => mutation.mutate("rejected")}
            variant="danger"
            className="min-h-11 min-w-32"
          >
            {pendingDecision === "rejected" ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <X size={14} />
            )}
            {status === "approved" ? "Reject instead" : getActionLabel("rejected", pendingDecision)}
          </Button>
        ) : null}
      </div>

      {mutation.isError && (
        <p role="alert" className="mt-3 text-xs font-semibold text-danger">
          The status could not be updated. Try again.
        </p>
      )}
    </div>
  );
}
