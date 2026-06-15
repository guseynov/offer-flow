import type { DealsErrorStateProps } from "@/types/deal";

export function DealsErrorState({ onRetry }: DealsErrorStateProps) {
  return (
    <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center">
      <span aria-hidden="true" className="mx-auto grid size-12 place-items-center rounded-xl bg-rose-100 text-xl font-bold text-rose-700">
        !
      </span>
      <h2 className="mt-4 text-lg font-bold text-rose-950">Deals could not be loaded</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-rose-700">
        The API request failed or returned an invalid response. Try the request again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-lg bg-rose-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
      >
        Retry
      </button>
    </div>
  );
}
