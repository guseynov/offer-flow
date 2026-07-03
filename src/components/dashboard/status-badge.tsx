import { Badge } from "@/components/ui/badge";
import type { StatusBadgeProps } from "@/types/dashboard";

function getVariant(status: StatusBadgeProps["status"]) {
  if (status === "approved") {
    return "success";
  }

  if (status === "pending") {
    return "warning";
  }

  if (status === "rejected") {
    return "danger";
  }

  return "muted";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant={getVariant(status)}
      className="gap-1.5 font-mono lowercase tracking-[0.04em]"
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  );
}
