import type { Metadata } from "next";
import Link from "next/link";
import { DealCreateForm } from "@/components/deals/create/deal-create-form";

export const metadata: Metadata = { title: "New deal" };

export default function NewDealPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/dashboard/deals"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-700 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
      >
        <span aria-hidden="true">←</span>
        Back to deals
      </Link>
      <div className="mt-7">
        <p className="text-sm font-semibold text-emerald-700">Catalog creation</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Create a new deal
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Draft a new marketplace offer. IDs and audit timestamps are assigned by the API.
        </p>
      </div>
      <div className="mt-8">
        <DealCreateForm />
      </div>
    </div>
  );
}
