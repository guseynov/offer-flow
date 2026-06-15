import type { Metadata } from "next";
import { MetricCard } from "@/components/dashboard/metric-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import type { DashboardMetric, DealActivity } from "@/types/dashboard";

export const metadata: Metadata = { title: "Dashboard" };

const metrics: DashboardMetric[] = [
  { label: "Pending deals", value: "24", helper: "6 awaiting review today", accent: "amber" as const, icon: "◷" },
  { label: "Approved deals", value: "142", helper: "12 approved this week", accent: "emerald" as const, icon: "✓" },
  { label: "Rejected deals", value: "8", helper: "3 require partner follow-up", accent: "rose" as const, icon: "×" },
  { label: "Orders today", value: "386", helper: "+8.4% from yesterday", accent: "blue" as const, icon: "□" },
  { label: "Total revenue", value: "$48.2k", helper: "+12.6% this month", accent: "violet" as const, icon: "$" },
];

const recentActivity: DealActivity[] = [
  { title: "Weekend Coffee Bundle", partner: "Northstar Roasters", status: "approved" as const, time: "10 min ago" },
  { title: "Summer Studio Pass", partner: "Form & Flow", status: "pending" as const, time: "32 min ago" },
  { title: "Neighborhood Dinner for Two", partner: "Table Eleven", status: "rejected" as const, time: "1 hr ago" },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Monday, June 15</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Operations overview</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Monitor deal reviews, order activity, and revenue across the marketplace.</p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm sm:self-auto">
          <span className="size-2 rounded-full bg-emerald-500" />Updated just now
        </div>
      </div>

      <section aria-labelledby="metrics-heading" className="mt-8">
        <h2 id="metrics-heading" className="sr-only">Key metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div><h2 className="font-bold text-slate-900">Recent deal activity</h2><p className="mt-1 text-sm text-slate-500">Latest operator decisions</p></div>
            <span className="text-xs font-semibold text-slate-400">Today</span>
          </div>
          <ul className="divide-y divide-slate-100">
            {recentActivity.map((item) => (
              <li key={item.title} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.partner} · {item.time}</p></div>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-[#1c3528] p-6 text-white shadow-[0_16px_40px_rgba(19,35,27,0.16)]">
          <div aria-hidden="true" className="absolute -right-14 -top-14 size-44 rounded-full border-[28px] border-emerald-300/10" />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Today&apos;s focus</p>
          <h2 className="mt-4 max-w-sm text-2xl font-bold leading-tight">Keep the review queue moving.</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-emerald-50/70">Six new submissions are waiting for an operator decision. The oldest has been pending for 3 hours.</p>
          <div className="mt-7 flex items-end justify-between border-t border-white/10 pt-5">
            <div><p className="text-3xl font-bold">75%</p><p className="mt-1 text-xs text-emerald-100/60">Daily review target</p></div>
            <div aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-emerald-400 text-xl text-[#13231b]">→</div>
          </div>
        </div>
      </section>
    </div>
  );
}
