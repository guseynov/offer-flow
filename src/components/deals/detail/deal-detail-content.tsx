import Link from "next/link";
import type { DealDetailContentProps } from "@/types/deal";
import { StatusBadge } from "@/components/dashboard/status-badge";

const detailRows = [
  { key: "categoryLabel", label: "Category" },
  { key: "partnerName", label: "Partner" },
  { key: "formattedPrice", label: "Price" },
] as const;

export function DealDetailContent({ deal }: DealDetailContentProps) {
  return (
    <div>
      <Link
        href="/dashboard/deals"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-700 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
      >
        <span aria-hidden="true">←</span>
        Back to deals
      </Link>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            {deal.id}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {deal.title}
          </h1>
        </div>
        <StatusBadge status={deal.status} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
              Description
            </p>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">
              {deal.description}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <h2 className="text-lg font-bold text-slate-900">Deal schedule</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">Starts</dt>
                <dd className="mt-2 text-sm font-semibold text-slate-800">{deal.startsAtLabel}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">Ends</dt>
                <dd className="mt-2 text-sm font-semibold text-slate-800">{deal.endsAtLabel}</dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <h2 className="text-lg font-bold text-slate-900">Deal summary</h2>
            <dl className="mt-5 divide-y divide-slate-100">
              {detailRows.map((row) => (
                <div key={row.key} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <dt className="text-sm text-slate-500">{row.label}</dt>
                  <dd className="text-right text-sm font-semibold text-slate-800">{deal[row.key]}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl bg-[#1c3528] p-6 text-white shadow-[0_16px_40px_rgba(19,35,27,0.12)]">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">Record history</p>
            <dl className="mt-5 space-y-5">
              <div>
                <dt className="text-xs text-emerald-100/60">Created</dt>
                <dd className="mt-1 text-sm font-semibold text-white">{deal.createdAtLabel}</dd>
              </div>
              <div>
                <dt className="text-xs text-emerald-100/60">Last updated</dt>
                <dd className="mt-1 text-sm font-semibold text-white">{deal.updatedAtLabel}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
