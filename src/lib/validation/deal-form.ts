import { dealFormSchema } from "@/lib/schemas/deal";
import type { DealFormErrors, DealFormValues } from "@/types/deal";

export function validateDealForm(values: DealFormValues): DealFormErrors {
  const result = dealFormSchema.safeParse(values);
  const errors: DealFormErrors = {};

  if (result.success) {
    return errors;
  }

  result.error.issues.forEach((issue) => {
    const field = issue.path[0] as keyof DealFormValues | undefined;

    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  });

  return errors;
}
