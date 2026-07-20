"use client";

import { useEffect } from "react";
import "./globals.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function GlobalError({
  error,
  unstable_retry,
}: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-background px-5 py-12 text-foreground antialiased">
        <title>Unexpected error | OfferFlow</title>
        <main
          role="alert"
          className="surface-panel-danger w-full max-w-xl rounded-[0.9rem] px-6 py-12 text-center"
        >
          <p className="ui-label text-danger">OfferFlow</p>
          <h1 className="mt-4 text-2xl font-bold text-(--text-strong)">
            The application could not be displayed
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-(--text-soft)">
            Reload the application to recover from this unexpected error.
          </p>
          <button
            type="button"
            onClick={unstable_retry}
            className="mt-6 inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Reload application
          </button>
          {error.digest ? (
            <p className="mt-5 text-xs text-(--text-faint)">
              Error reference: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}

