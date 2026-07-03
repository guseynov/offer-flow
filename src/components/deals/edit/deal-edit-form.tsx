"use client";

import clsx from "clsx";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { DateTimeRangePicker } from "@/components/ui/date-time-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateDeal } from "@/lib/api/deals";
import { categoryFilterOptions, statusFilterOptions } from "@/lib/deal-filters";
import { mapDealFormValuesToUpdatePayload } from "@/lib/mappers/deal";
import { dealKeys } from "@/lib/query-keys";
import { validateDealForm } from "@/lib/validation/deal-form";
import { partnerOptions } from "@/mocks/partners";
import type {
  DealEditFormProps,
  DealFormValues,
  UpdateDealPayload,
} from "@/types/deal";

export function DealEditForm({ dealId, initialValues }: DealEditFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (payload: UpdateDealPayload) => updateDeal(dealId, payload),
    onSuccess: async (updatedDeal) => {
      queryClient.setQueryData(dealKeys.detail(dealId), updatedDeal);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) }),
        queryClient.invalidateQueries({ queryKey: dealKeys.all }),
      ]);
      router.push(`/dashboard/deals/${dealId}`);
    },
  });

  const formik = useFormik<DealFormValues>({
    initialValues,
    validate: validateDealForm,
    onSubmit: async (values) => {
      try {
        await mutation.mutateAsync(mapDealFormValuesToUpdatePayload(values));
      } catch {
        // Mutation state renders the request error below the form.
      }
    },
  });

  function getFieldError(field: keyof DealFormValues) {
    if (formik.touched[field]) {
      return formik.errors[field];
    }

    return undefined;
  }

  function getFieldClass(field: keyof DealFormValues) {
    const error = getFieldError(field);

    return clsx({
      "border-danger focus-visible:ring-danger":
        Boolean(error),
    });
  }

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
      <section className="surface-panel rounded-[0.9rem] p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <Label>Offer title</Label>
            <Input
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(getFieldError("title"))}
              className={clsx(getFieldClass("title"), "mt-2")}
            />
            {getFieldError("title") && (
              <p className="mt-1.5 text-xs font-medium text-danger">
                {getFieldError("title")}
              </p>
            )}
          </label>

          <label className="block sm:col-span-2">
            <Label>Offer description</Label>
            <Textarea
              name="description"
              rows={5}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(getFieldError("description"))}
              className={clsx(
                getFieldClass("description"),
                "mt-2 min-h-32 resize-y",
              )}
            />
            {getFieldError("description") && (
              <p className="mt-1.5 text-xs font-medium text-danger">
                {getFieldError("description")}
              </p>
            )}
          </label>

          <label className="block">
            <Label>Category</Label>
            <Select
              value={formik.values.category}
              onValueChange={(value) =>
                void formik.setFieldValue("category", value)
              }
            >
              <SelectTrigger
                className={clsx(getFieldClass("category"), "mt-2 h-11")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="block">
            <Label>Offer value (USD)</Label>
            <Input
              name="price"
              inputMode="decimal"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(getFieldError("price"))}
              className={clsx(getFieldClass("price"), "mt-2")}
            />
            {getFieldError("price") && (
              <p className="mt-1.5 text-xs font-medium text-danger">
                {getFieldError("price")}
              </p>
            )}
            <p className="mt-1.5 text-xs text-(--text-faint)">
              Converted to integer cents on submit.
            </p>
          </label>

          <label className="block">
            <Label>Workflow status</Label>
            <Select
              value={formik.values.status}
              onValueChange={(value) =>
                void formik.setFieldValue("status", value)
              }
            >
              <SelectTrigger
                className={clsx(getFieldClass("status"), "mt-2 h-11")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusFilterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="block">
            <Label>Partner</Label>
            <Select
              value={formik.values.partnerId}
              onValueChange={(value) =>
                void formik.setFieldValue("partnerId", value)
              }
            >
              <SelectTrigger
                className={clsx(getFieldClass("partnerId"), "mt-2 h-11")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {partnerOptions.map((partner) => (
                  <SelectItem key={partner.id} value={partner.id}>
                    {partner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
        </div>
      </section>

      <section className="surface-panel rounded-[0.9rem] p-5 sm:p-6">
        <h2 className="text-xl font-bold tracking-[-0.02em] text-(--text-strong)">
          Schedule
        </h2>
        <p className="mt-1 text-sm text-(--text-muted)">
          Offer windows are edited in the form and stored in UTC.
        </p>
        <div className="mt-5">
          <div className="block">
            <Label>Offer window</Label>
            <DateTimeRangePicker
              startsAt={formik.values.startsAt}
              endsAt={formik.values.endsAt}
              onStartsAtChange={(value) =>
                void formik.setFieldValue("startsAt", value)
              }
              onEndsAtChange={(value) =>
                void formik.setFieldValue("endsAt", value)
              }
              onBlur={() => {
                void formik.setFieldTouched("startsAt", true);
                void formik.setFieldTouched("endsAt", true);
              }}
              startAriaInvalid={Boolean(getFieldError("startsAt"))}
              endAriaInvalid={Boolean(getFieldError("endsAt"))}
              className={clsx(
                getFieldClass("startsAt"),
                getFieldClass("endsAt"),
              )}
              defaultStartTime="09:00"
              defaultEndTime="18:00"
            />
            {getFieldError("startsAt") && (
              <p className="mt-1.5 text-xs font-medium text-danger">
                {getFieldError("startsAt")}
              </p>
            )}
            {getFieldError("endsAt") && (
              <p className="mt-1.5 text-xs font-medium text-danger">
                {getFieldError("endsAt")}
              </p>
            )}
          </div>
        </div>
      </section>

      {mutation.isError && (
        <div
          role="alert"
          className="surface-panel-danger rounded-[1rem] px-4 py-3 text-sm font-medium text-(--text-strong)"
        >
          The offer could not be updated. Review the values and try again.
        </div>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        <Button asChild variant="secondary">
          <Link href={`/dashboard/deals/${dealId}`}>Cancel</Link>
        </Button>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className={
            mutation.isPending ? "cursor-wait opacity-70 saturate-50" : ""
          }
        >
          {mutation.isPending && "Saving…"}
          {!mutation.isPending && "Save changes"}
        </Button>
      </div>
    </form>
  );
}
