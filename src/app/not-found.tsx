import { SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 py-12">
      <div className="surface-panel w-full max-w-xl rounded-[0.9rem] px-6 py-12 text-center">
        <span
          aria-hidden="true"
          className="surface-panel-soft mx-auto grid size-12 place-items-center rounded-xl text-(--text-muted)"
        >
          <SearchX size={18} strokeWidth={2.25} />
        </span>
        <p className="ui-label mt-5">404</p>
        <h1 className="mt-3 text-2xl font-bold text-(--text-strong)">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-(--text-soft)">
          The address may be incorrect, or the page may have moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/dashboard/deals">Browse offers</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

