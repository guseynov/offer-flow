import type { Metadata } from "next";
import Link from "next/link";
import { DealCreateForm } from "@/components/deals/create/deal-create-form";

export const metadata: Metadata = { title: "New offer" };

export default function NewDealPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/dashboard/deals"
        className="ui-link inline-flex items-center gap-2 text-sm font-semibold"
      >
        <span aria-hidden="true">←</span>
        Back to offers
      </Link>
      <div className="mt-7">
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-(--text-strong) sm:text-4xl">
          Create a new offer
        </h1>
      </div>
      <div className="mt-8">
        <DealCreateForm />
      </div>
    </div>
  );
}
