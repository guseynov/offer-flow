import { createDealFormSchema } from "@/lib/schemas/deal";
import type {
  DealCreateFormErrors,
  DealCreateFormValues,
} from "@/types/deal";

export function validateDealCreateForm(
  values: DealCreateFormValues,
): DealCreateFormErrors {
  const result = createDealFormSchema.safeParse(values);
  const errors: DealCreateFormErrors = {};

  if (result.success) {
    return errors;
  }

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as keyof DealCreateFormValues | undefined;

    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  });

  return errors;
}
