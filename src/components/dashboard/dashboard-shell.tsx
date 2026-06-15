import type { ChildrenProps } from "@/types/dashboard";
import { Sidebar } from "./sidebar";

export function DashboardShell({ children }: ChildrenProps) {
  return (
    <div className="min-h-screen bg-stone-100 lg:grid lg:grid-cols-[17rem_1fr]">
      <Sidebar />
      <div className="min-w-0">
        <header className="flex h-18 items-center justify-between border-b border-slate-200/80 bg-white px-5 sm:px-8 lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Operations workspace</p>
            <p className="mt-0.5 text-sm font-medium text-slate-700">Community commerce</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-semibold text-slate-800">Alex Morgan</span>
              <span className="block text-xs text-slate-500">Operations</span>
            </span>
            <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800 ring-4 ring-emerald-50">AM</span>
          </div>
        </header>
        <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
