"use client";

import { cva } from "class-variance-authority";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setDealDecision } from "@/lib/api/deals";
import { dealKeys } from "@/lib/query-keys";
import type {
  DealDecision,
  DealStatus,
  DealStatusActionsProps,
} from "@/types/deal";

const actionButtonVariants = cva(
  "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      intent: {
        approve:
          "bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:outline-emerald-700",
        reject:
          "border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 focus-visible:outline-rose-700",
      },
      pending: {
        true: "cursor-wait opacity-70",
        false: "",
      },
    },
    defaultVariants: { pending: false },
  },
);

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

function getActionLabel(
  action: DealDecision,
  pendingDecision: DealDecision | undefined,
) {
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
    onSuccess: async (updatedDeal) => {
      queryClient.setQueryData(dealKeys.detail(dealId), updatedDeal);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) }),
        queryClient.invalidateQueries({ queryKey: dealKeys.all }),
      ]);
    },
  });

  const pendingDecision = mutation.variables;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isDecisionDisabled(status, "approved", mutation.isPending)}
          onClick={() => mutation.mutate("approved")}
          className={actionButtonVariants({
            intent: "approve",
            pending: pendingDecision === "approved",
          })}
        >
          {getActionLabel("approved", pendingDecision)}
        </button>
        <button
          type="button"
          disabled={isDecisionDisabled(status, "rejected", mutation.isPending)}
          onClick={() => mutation.mutate("rejected")}
          className={actionButtonVariants({
            intent: "reject",
            pending: pendingDecision === "rejected",
          })}
        >
          {getActionLabel("rejected", pendingDecision)}
        </button>
      </div>
      {mutation.isError && (
        <p role="alert" className="mt-2 text-xs font-semibold text-rose-700">
          The status could not be updated. Try again.
        </p>
      )}
    </div>
  );
}
