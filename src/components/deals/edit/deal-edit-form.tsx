"use client";

import { isAxiosError } from "axios";
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
import { categoryFilterOptions } from "@/lib/deal-filters";
import {
  MAX_DEAL_DESCRIPTION_LENGTH,
  MAX_DEAL_TITLE_LENGTH,
} from "@/lib/deal-limits";
import { mapDealFormValuesToUpdatePayload } from "@/lib/mappers/deal";
import { dealKeys } from "@/lib/query-keys";
import { validateDealForm } from "@/lib/validation/deal-form";
import { partnerOptions } from "@/mocks/partners";
import type {
  DealEditFormProps,
  DealFormValues,
  UpdateDealPayload,
} from "@/types/deal";

export function DealEditForm({
  dealId,
  initialValues,
  initialUpdatedAt,
}: DealEditFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: (payload: UpdateDealPayload) => updateDeal(dealId, payload),
    onSuccess: async (updatedDeal) => {
      queryClient.setQueryData(dealKeys.detail(dealId), updatedDeal);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) }),
        queryClient.invalidateQueries({ queryKey: dealKeys.all }),
        queryClient.invalidateQueries({ queryKey: dealKeys.dashboard }),
      ]);
      router.push(`/dashboard/deals/${dealId}`);
    },
  });

  const formik = useFormik<DealFormValues>({
    initialValues,
    enableReinitialize: true,
    validate: validateDealForm,
    onSubmit: async (values) => {
      try {
        await mutation.mutateAsync(
          mapDealFormValuesToUpdatePayload(values, initialUpdatedAt),
        );
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

  function getErrorId(field: keyof DealFormValues) {
    return getFieldError(field) ? `edit-${field}-error` : undefined;
  }

  const hasStaleConflict =
    isAxiosError(mutation.error) && mutation.error.response?.status === 409;

  async function reloadLatestVersion() {
    await queryClient.invalidateQueries({ queryKey: dealKeys.detail(dealId) });
    mutation.reset();
  }

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
      <section className="surface-panel rounded-[0.9rem] p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="block sm:col-span-2">
            <Label htmlFor="edit-title">Offer title</Label>
            <Input
              id="edit-title"
              name="title"
              maxLength={MAX_DEAL_TITLE_LENGTH}
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(getFieldError("title"))}
              aria-describedby={getErrorId("title")}
              className={clsx(getFieldClass("title"), "mt-2")}
            />
            {getFieldError("title") && (
              <p
                id="edit-title-error"
                className="mt-1.5 text-xs font-medium text-danger"
              >
                {getFieldError("title")}
              </p>
            )}
          </div>

          <div className="block sm:col-span-2">
            <Label htmlFor="edit-description">Offer description</Label>
            <Textarea
              id="edit-description"
              name="description"
              maxLength={MAX_DEAL_DESCRIPTION_LENGTH}
              rows={5}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(getFieldError("description"))}
              aria-describedby={getErrorId("description")}
              className={clsx(
                getFieldClass("description"),
                "mt-2 min-h-32 resize-y",
              )}
            />
            {getFieldError("description") && (
              <p
                id="edit-description-error"
                className="mt-1.5 text-xs font-medium text-danger"
              >
                {getFieldError("description")}
              </p>
            )}
          </div>

          <div className="block">
            <Label htmlFor="edit-category">Category</Label>
            <Select
              value={formik.values.category}
              onValueChange={(value) =>
                void formik.setFieldValue("category", value)
              }
            >
              <SelectTrigger
                id="edit-category"
                aria-invalid={Boolean(getFieldError("category"))}
                aria-describedby={getErrorId("category")}
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
          </div>

          <div className="block">
            <Label htmlFor="edit-price">Offer value (USD)</Label>
            <Input
              id="edit-price"
              name="price"
              inputMode="decimal"
              maxLength={10}
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(getFieldError("price"))}
              aria-describedby={
                getFieldError("price")
                  ? "edit-price-help edit-price-error"
                  : "edit-price-help"
              }
              className={clsx(getFieldClass("price"), "mt-2")}
            />
            {getFieldError("price") && (
              <p
                id="edit-price-error"
                className="mt-1.5 text-xs font-medium text-danger"
              >
                {getFieldError("price")}
              </p>
            )}
            <p
              id="edit-price-help"
              className="mt-1.5 text-xs text-(--text-faint)"
            >
              Converted to integer cents on submit.
            </p>
          </div>

          <div className="block sm:col-span-2">
            <Label htmlFor="edit-partner">Partner</Label>
            <Select
              value={formik.values.partnerId}
              onValueChange={(value) =>
                void formik.setFieldValue("partnerId", value)
              }
            >
              <SelectTrigger
                id="edit-partner"
                aria-invalid={Boolean(getFieldError("partnerId"))}
                aria-describedby={getErrorId("partnerId")}
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
          </div>
        </div>
      </section>

      <section className="surface-panel rounded-[0.9rem] p-5 sm:p-6">
        <h2 className="text-xl font-bold tracking-[-0.02em] text-(--text-strong)">
          Schedule
        </h2>
        <p className="mt-1 text-sm text-(--text-muted)">
          All offer dates and times are entered and stored in UTC.
        </p>
        <div className="mt-5">
          <div className="block">
            <Label htmlFor="edit-offer-window-date-range">
              Offer window (UTC)
            </Label>
            <DateTimeRangePicker
              idPrefix="edit-offer-window"
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
              dateAriaDescribedBy={
                [getErrorId("startsAt"), getErrorId("endsAt")]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              startAriaDescribedBy={getErrorId("startsAt")}
              endAriaDescribedBy={getErrorId("endsAt")}
              className={clsx(
                getFieldClass("startsAt"),
                getFieldClass("endsAt"),
              )}
              defaultStartTime="09:00"
              defaultEndTime="18:00"
            />
            {getFieldError("startsAt") && (
              <p
                id="edit-startsAt-error"
                className="mt-1.5 text-xs font-medium text-danger"
              >
                {getFieldError("startsAt")}
              </p>
            )}
            {getFieldError("endsAt") && (
              <p
                id="edit-endsAt-error"
                className="mt-1.5 text-xs font-medium text-danger"
              >
                {getFieldError("endsAt")}
              </p>
            )}
          </div>
        </div>
      </section>

      {hasStaleConflict && (
        <div
          role="alert"
          className="rounded-[1rem] border border-warning bg-warning-soft px-4 py-3 text-sm text-(--text-strong)"
        >
          <p className="font-semibold">A newer version of this offer exists.</p>
          <p className="mt-1 text-(--text-soft)">
            Reload the latest version before applying your changes so a recent
            review decision or edit is not overwritten.
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={() => void reloadLatestVersion()}
          >
            Reload latest version
          </Button>
        </div>
      )}

      {mutation.isError && !hasStaleConflict && (
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
