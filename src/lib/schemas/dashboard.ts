import { z } from "zod";
import { dealDtoSchema, dealStatusSchema } from "@/lib/schemas/deal";

export const dashboardDataSchema = z.object({
  summary: z.object({
    total: z.number().int().nonnegative(),
    draft: z.number().int().nonnegative(),
    pending: z.number().int().nonnegative(),
    approved: z.number().int().nonnegative(),
    rejected: z.number().int().nonnegative(),
    approvedValueCents: z.number().int().nonnegative(),
  }),
  statusSeries: z.array(
    z.object({
      status: dealStatusSchema,
      label: z.string(),
      count: z.number().int().nonnegative(),
    }),
  ),
  pendingDeals: z.array(dealDtoSchema),
  recentDeals: z.array(dealDtoSchema),
});

