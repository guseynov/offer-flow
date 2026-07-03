import type { ChildrenProps } from "@/types/dashboard";
import { Sidebar } from "./sidebar";

export function DashboardShell({ children }: ChildrenProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[11.5rem_1fr]">
      <Sidebar />
      <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-5 xl:px-6">{children}</main>
    </div>
  );
}
