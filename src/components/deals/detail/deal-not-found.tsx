import { SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DealNotFound() {
  return (
    <div className="surface-panel rounded-[0.9rem] px-6 py-14 text-center">
      <span
        aria-hidden="true"
        className="surface-panel-soft mx-auto grid size-12 place-items-center rounded-xl text-(--text-muted)"
      >
        <SearchX size={18} strokeWidth={2.25} />
      </span>
      <h1 className="mt-4 text-xl font-bold text-(--text-strong)">
        Offer not found
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-(--text-soft)">
        This offer does not exist or was removed from the current data store.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard/deals">Back to offers</Link>
      </Button>
    </div>
  );
}

