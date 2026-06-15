import type { ChildrenProps } from "@/types/dashboard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { QueryProvider } from "@/components/providers/query-provider";

export default function DashboardLayout({ children }: ChildrenProps) {
  return (
    <QueryProvider>
      <DashboardShell>{children}</DashboardShell>
    </QueryProvider>
  );
}
