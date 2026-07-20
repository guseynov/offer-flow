"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type AppErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function AppError({ error, unstable_retry }: AppErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-[70vh] place-items-center px-5 py-12">
      <div
        role="alert"
        className="surface-panel-danger w-full max-w-xl rounded-[0.9rem] px-6 py-12 text-center"
      >
        <span
          aria-hidden="true"
          className="mx-auto grid size-12 place-items-center rounded-xl border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] bg-danger-soft text-danger"
        >
          <AlertTriangle size={18} strokeWidth={2.25} />
        </span>
        <h1 className="mt-4 text-xl font-bold text-(--text-strong)">
          This page encountered an unexpected error
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-(--text-soft)">
          Try loading the page again. If the problem continues, return to the
          offers dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button type="button" variant="danger" onClick={unstable_retry}>
            <RefreshCw size={14} />
            Try again
          </Button>
          <Button asChild variant="secondary">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
        {error.digest ? (
          <p className="mt-5 text-xs text-(--text-faint)">
            Error reference: {error.digest}
          </p>
        ) : null}
      </div>
    </main>
  );
}

