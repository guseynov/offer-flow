import Link from "next/link";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import type { DealDetailContentProps } from "@/types/deal";
import { DealStatusActions } from "./deal-status-actions";

export function DealDetailContent({
  deal,
  history,
}: DealDetailContentProps) {
  return (
    <div className="mx-auto max-w-380">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="inline-flex h-auto items-center gap-2 px-0 py-0 text-sm font-semibold text-(--text-muted) hover:text-(--text-strong)"
      >
        <Link href="/dashboard/deals">
          <span aria-hidden="true">←</span>
          Back to offers
        </Link>
      </Button>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_22rem]">
        <div className="space-y-6">
          <section className="surface-panel-strong rounded-[0.9rem] p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <p className="ui-label">{deal.id}</p>
              <StatusBadge status={deal.status} />
            </div>

            <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-4xl">
                <h1 className="text-3xl font-bold tracking-[-0.03em] text-(--text-strong) sm:text-4xl">
                  {deal.title}
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-8 text-(--text-soft)">
                  {deal.description}
                </p>
              </div>
              <Button asChild variant="secondary">
                <Link href={`/dashboard/deals/${deal.id}/edit`}>
                  Edit offer
                </Link>
              </Button>
            </div>

            <dl className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.8fr)]">
              <div className="surface-panel-soft rounded-[1rem] px-4 py-4">
                <dt className="ui-label">Offer window</dt>
                <dd className="mt-3 text-sm font-semibold text-(--text-strong)">
                  {deal.dateRangeLabel}
                </dd>
              </div>
              <div className="surface-panel-soft rounded-[1rem] px-4 py-4">
                <dt className="ui-label">Partner</dt>
                <dd className="mt-3 text-sm font-semibold text-(--text-strong)">
                  {deal.partnerName}
                </dd>
              </div>
              <div className="surface-panel-soft rounded-[1rem] px-4 py-4">
                <dt className="ui-label">Offer value</dt>
                <dd className="mt-3 text-sm font-semibold text-(--text-strong)">
                  {deal.formattedPrice}
                </dd>
              </div>
            </dl>
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.9fr)]">
            <section className="surface-panel rounded-[0.9rem] p-6">
              <h2 className="text-xl font-bold tracking-[-0.02em] text-(--text-strong)">
                Offer details
              </h2>
              <dl className="mt-5 divide-y divide-white/6">
                <div className="flex items-start justify-between gap-4 py-4 first:pt-0">
                  <dt className="text-sm text-(--text-faint)">Category</dt>
                  <dd className="text-right text-sm font-semibold text-(--text-strong)">
                    {deal.categoryLabel}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-4">
                  <dt className="text-sm text-(--text-faint)">Starts</dt>
                  <dd className="text-right text-sm font-semibold text-(--text-strong)">
                    {deal.startsAtLabel}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-4">
                  <dt className="text-sm text-(--text-faint)">Ends</dt>
                  <dd className="text-right text-sm font-semibold text-(--text-strong)">
                    {deal.endsAtLabel}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-4 last:pb-0">
                  <dt className="text-sm text-(--text-faint)">Last updated</dt>
                  <dd className="text-right text-sm font-semibold text-(--text-strong)">
                    {deal.updatedAtLabel}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="surface-panel rounded-[0.9rem] p-6">
              <h2 className="text-xl font-bold tracking-[-0.02em] text-(--text-strong)">
                Record history
              </h2>
              <ol className="mt-5 space-y-4">
                {history.map((event) => (
                  <li key={event.id} className="surface-panel-soft rounded-[1rem] px-4 py-4">
                    <p className="text-sm font-semibold text-(--text-strong)">
                      {event.previousStatus} → {event.nextStatus}
                    </p>
                    <p className="mt-1 text-xs text-(--text-muted)">
                      {event.actorName} · {new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "UTC",
                      }).format(new Date(event.createdAt))} UTC
                    </p>
                    {event.reason ? (
                      <p className="mt-2 text-sm text-(--text-soft)">{event.reason}</p>
                    ) : null}
                  </li>
                ))}
                {history.length === 0 ? (
                  <li className="text-sm text-(--text-muted)">No review decisions recorded yet.</li>
                ) : null}
              </ol>
              <dl className="mt-5 space-y-5 border-t border-white/6 pt-5">
                <div className="surface-panel-soft rounded-[1rem] px-4 py-4">
                  <dt className="ui-label">Created</dt>
                  <dd className="mt-3 text-sm font-semibold text-(--text-strong)">
                    {deal.createdAtLabel}
                  </dd>
                </div>
                <div className="surface-panel-soft rounded-[1rem] px-4 py-4">
                  <dt className="ui-label">Last updated</dt>
                  <dd className="mt-3 text-sm font-semibold text-(--text-strong)">
                    {deal.updatedAtLabel}
                  </dd>
                </div>
              </dl>
            </section>
          </section>
        </div>

        <aside aria-label="Review controls and record snapshot" className="surface-panel rounded-[0.9rem] p-6 xl:sticky xl:top-6 xl:self-start">
          <p className="ui-label">Review decision</p>

          <div className="mt-6">
            <DealStatusActions
              dealId={deal.id}
              status={deal.status}
              expectedUpdatedAt={deal.updatedAt}
            />
          </div>

          <div className="mt-8 border-t border-white/6 pt-6">
            <p className="ui-label">Record snapshot</p>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-(--text-faint)">
                  Offer ID
                </dt>
                <dd className="mt-1 text-sm font-semibold text-(--text-strong)">
                  {deal.id}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-(--text-faint)">
                  Partner
                </dt>
                <dd className="mt-1 text-sm font-semibold text-(--text-strong)">
                  {deal.partnerName}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.12em] text-(--text-faint)">
                  Category
                </dt>
                <dd className="mt-1 text-sm font-semibold text-(--text-strong)">
                  {deal.categoryLabel}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </div>
  );
}
