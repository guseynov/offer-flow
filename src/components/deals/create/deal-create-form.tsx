"use client";

import { cva } from "class-variance-authority";
import clsx from "clsx";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDeal } from "@/lib/api/deals";
import { categoryFilterOptions } from "@/lib/deal-filters";
import { mapDealCreateFormValuesToPayload } from "@/lib/mappers/deal";
import { dealKeys } from "@/lib/query-keys";
import { validateDealCreateForm } from "@/lib/validation/deal-create-form";
import { partnerOptions } from "@/mocks/partners";
import type {
  CreateDealPayload,
  DealCreateFormValues,
} from "@/types/deal";

const submitButtonVariants = cva(
  "inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700",
  {
    variants: {
      pending: {
        true: "cursor-wait bg-emerald-400",
        false: "bg-emerald-700 hover:bg-emerald-800",
      },
    },
    defaultVariants: { pending: false },
  },
);

const fieldClassName =
  "mt-2 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100";

const createStatusOptions = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
] as const;

const initialValues: DealCreateFormValues = {
  title: "",
  description: "",
  category: "food-drink",
  price: "",
  status: "draft",
  partnerId: "partner-001",
  startsAt: "",
  endsAt: "",
};

export function DealCreateForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (payload: CreateDealPayload) => createDeal(payload),
    onSuccess: async (createdDeal) => {
      queryClient.setQueryData(dealKeys.detail(createdDeal.id), createdDeal);
      await queryClient.invalidateQueries({ queryKey: dealKeys.all });
      router.push(`/dashboard/deals/${createdDeal.id}`);
    },
  });

  const formik = useFormik<DealCreateFormValues>({
    initialValues,
    validate: validateDealCreateForm,
    onSubmit: async (values) => {
      try {
        await mutation.mutateAsync(mapDealCreateFormValuesToPayload(values));
      } catch {
        // Mutation state renders the request error below the form.
      }
    },
  });

  function getFieldError(field: keyof DealCreateFormValues) {
    if (formik.touched[field]) {
      return formik.errors[field];
    }

    return undefined;
  }

  function getFieldClass(field: keyof DealCreateFormValues) {
    const error = getFieldError(field);

    return clsx(fieldClassName, {
      "border-rose-400 focus:border-rose-500 focus:ring-rose-100": Boolean(error),
      "border-slate-200": !error,
    });
  }

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">Deal information</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Title</span>
            <input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(getFieldError("title"))}
              className={getFieldClass("title")}
            />
            {getFieldError("title") && (
              <p className="mt-1.5 text-xs font-medium text-rose-700">{getFieldError("title")}</p>
            )}
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <textarea
              name="description"
              rows={5}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(getFieldError("description"))}
              className={getFieldClass("description")}
            />
            {getFieldError("description") && (
              <p className="mt-1.5 text-xs font-medium text-rose-700">{getFieldError("description")}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Category</span>
            <select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={getFieldClass("category")}
            >
              {categoryFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Price (USD)</span>
            <input
              name="price"
              inputMode="decimal"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(getFieldError("price"))}
              className={getFieldClass("price")}
            />
            {getFieldError("price") && (
              <p className="mt-1.5 text-xs font-medium text-rose-700">{getFieldError("price")}</p>
            )}
            <p className="mt-1.5 text-xs text-slate-400">Converted to integer cents on submit.</p>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Status</span>
            <select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={getFieldClass("status")}
            >
              {createStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Partner</span>
            <select
              name="partnerId"
              value={formik.values.partnerId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={getFieldClass("partnerId")}
            >
              {partnerOptions.map((partner) => (
                <option key={partner.id} value={partner.id}>{partner.name}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">Schedule</h2>
        <p className="mt-1 text-sm text-slate-500">Dates are entered and stored in UTC.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Starts at</span>
            <input
              type="datetime-local"
              name="startsAt"
              value={formik.values.startsAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(getFieldError("startsAt"))}
              className={getFieldClass("startsAt")}
            />
            {getFieldError("startsAt") && (
              <p className="mt-1.5 text-xs font-medium text-rose-700">{getFieldError("startsAt")}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Ends at</span>
            <input
              type="datetime-local"
              name="endsAt"
              value={formik.values.endsAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(getFieldError("endsAt"))}
              className={getFieldClass("endsAt")}
            />
            {getFieldError("endsAt") && (
              <p className="mt-1.5 text-xs font-medium text-rose-700">{getFieldError("endsAt")}</p>
            )}
          </label>
        </div>
      </section>

      {mutation.isError && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          The deal could not be created. Review the values and try again.
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        <Link
          href="/dashboard/deals"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={mutation.isPending}
          className={submitButtonVariants({ pending: mutation.isPending })}
        >
          {mutation.isPending && "Creating…"}
          {!mutation.isPending && "Create deal"}
        </button>
      </div>
    </form>
  );
}
