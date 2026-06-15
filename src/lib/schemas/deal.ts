import { z } from "zod";

export const dealStatusSchema = z.enum([
  "draft",
  "pending",
  "approved",
  "rejected",
]);

export const dealDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum([
    "food-drink",
    "wellness",
    "home",
    "experiences",
    "services",
  ]),
  priceCents: z.number().int().nonnegative(),
  status: dealStatusSchema,
  partnerId: z.string(),
  partnerName: z.string(),
  startsAt: z.iso.datetime(),
  endsAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const dealsResponseSchema = z.object({
  data: z.array(dealDtoSchema),
});

export const dealResponseSchema = z.object({
  data: dealDtoSchema,
});
