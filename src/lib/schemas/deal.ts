import { z } from "zod";
import {
  MAX_DEAL_DESCRIPTION_LENGTH,
  MAX_DEAL_PRICE_CENTS,
  MAX_DEAL_TITLE_LENGTH,
  MAX_PARTNER_ID_LENGTH,
  MAX_PARTNER_NAME_LENGTH,
} from "@/lib/deal-limits";

export const dealStatusSchema = z.enum([
  "draft",
  "pending",
  "approved",
  "rejected",
]);

export const dealDtoSchema = z.object({
  id: z.string(),
  title: z.string().max(MAX_DEAL_TITLE_LENGTH),
  description: z.string().max(MAX_DEAL_DESCRIPTION_LENGTH),
  category: z.enum([
    "food-drink",
    "wellness",
    "home",
    "experiences",
    "services",
  ]),
  priceCents: z.number().int().nonnegative().max(MAX_DEAL_PRICE_CENTS),
  status: dealStatusSchema,
  partnerId: z.string().max(MAX_PARTNER_ID_LENGTH),
  partnerName: z.string().max(MAX_PARTNER_NAME_LENGTH),
  startsAt: z.iso.datetime(),
  endsAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const dealsResponseSchema = z.object({
  data: z.array(dealDtoSchema),
  pageInfo: z.object({
    total: z.number().int().nonnegative(),
    hasNextPage: z.boolean(),
    nextCursor: z.string().nullable(),
  }),
});

export const dealsQuerySchema = z.object({
  q: z.string().trim().max(MAX_DEAL_TITLE_LENGTH).default(""),
  status: dealStatusSchema.optional(),
  category: dealDtoSchema.shape.category.optional(),
  cursor: z.string().max(200).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const dealResponseSchema = z.object({
  data: dealDtoSchema,
});

export const dealFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters.")
      .max(
        MAX_DEAL_TITLE_LENGTH,
        `Title must be ${MAX_DEAL_TITLE_LENGTH} characters or fewer.`,
      ),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters.")
      .max(
        MAX_DEAL_DESCRIPTION_LENGTH,
        `Description must be ${MAX_DEAL_DESCRIPTION_LENGTH.toLocaleString()} characters or fewer.`,
      ),
    category: dealDtoSchema.shape.category,
    price: z
      .string()
      .trim()
      .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price with up to 2 decimals.")
      .refine((value) => Number(value) > 0, "Price must be greater than zero.")
      .refine(
        (value) => Number(value) * 100 <= MAX_DEAL_PRICE_CENTS,
        "Price must be $1,000,000 or less.",
      ),
    status: dealStatusSchema,
    partnerId: z
      .string()
      .min(1, "Select a partner.")
      .max(MAX_PARTNER_ID_LENGTH),
    startsAt: z.string().min(1, "Start date is required."),
    endsAt: z.string().min(1, "End date is required."),
  })
  .refine(
    (values) => new Date(values.endsAt).getTime() > new Date(values.startsAt).getTime(),
    {
      message: "End date must be after the start date.",
      path: ["endsAt"],
    },
  );

export const updateDealPayloadSchema = z
  .object({
    title: z.string().trim().min(3).max(MAX_DEAL_TITLE_LENGTH),
    description: z.string().trim().min(10).max(MAX_DEAL_DESCRIPTION_LENGTH),
    category: dealDtoSchema.shape.category,
    priceCents: z.number().int().positive().max(MAX_DEAL_PRICE_CENTS),
    partnerId: z.string().min(1).max(MAX_PARTNER_ID_LENGTH),
    startsAt: z.iso.datetime(),
    endsAt: z.iso.datetime(),
    expectedUpdatedAt: z.iso.datetime(),
  })
  .strict()
  .refine(
    (payload) =>
      new Date(payload.endsAt).getTime() >
      new Date(payload.startsAt).getTime(),
    { message: "End date must be after the start date.", path: ["endsAt"] },
  );

export const createDealStatusSchema = z.enum(["draft", "pending"]);

export const createDealFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters.")
      .max(
        MAX_DEAL_TITLE_LENGTH,
        `Title must be ${MAX_DEAL_TITLE_LENGTH} characters or fewer.`,
      ),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters.")
      .max(
        MAX_DEAL_DESCRIPTION_LENGTH,
        `Description must be ${MAX_DEAL_DESCRIPTION_LENGTH.toLocaleString()} characters or fewer.`,
      ),
    category: dealDtoSchema.shape.category,
    price: z
      .string()
      .trim()
      .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price with up to 2 decimals.")
      .refine((value) => Number(value) > 0, "Price must be greater than zero.")
      .refine(
        (value) => Number(value) * 100 <= MAX_DEAL_PRICE_CENTS,
        "Price must be $1,000,000 or less.",
      ),
    status: createDealStatusSchema,
    partnerId: z
      .string()
      .min(1, "Select a partner.")
      .max(MAX_PARTNER_ID_LENGTH),
    startsAt: z.string().min(1, "Start date is required."),
    endsAt: z.string().min(1, "End date is required."),
  })
  .refine(
    (values) => new Date(values.endsAt).getTime() > new Date(values.startsAt).getTime(),
    {
      message: "End date must be after the start date.",
      path: ["endsAt"],
    },
  );

export const createDealPayloadSchema = z
  .object({
    title: z.string().trim().min(3).max(MAX_DEAL_TITLE_LENGTH),
    description: z.string().trim().min(10).max(MAX_DEAL_DESCRIPTION_LENGTH),
    category: dealDtoSchema.shape.category,
    priceCents: z.number().int().positive().max(MAX_DEAL_PRICE_CENTS),
    status: createDealStatusSchema,
    partnerId: z.string().min(1).max(MAX_PARTNER_ID_LENGTH),
    startsAt: z.iso.datetime(),
    endsAt: z.iso.datetime(),
  })
  .strict()
  .refine(
    (payload) =>
      new Date(payload.endsAt).getTime() > new Date(payload.startsAt).getTime(),
    { message: "End date must be after the start date.", path: ["endsAt"] },
  );
