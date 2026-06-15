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

export const dealFormSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters."),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters."),
    category: dealDtoSchema.shape.category,
    price: z
      .string()
      .trim()
      .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price with up to 2 decimals.")
      .refine((value) => Number(value) > 0, "Price must be greater than zero."),
    status: dealStatusSchema,
    partnerId: z.string().min(1, "Select a partner."),
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

export const updateDealPayloadSchema = z.object({
  title: z.string().trim().min(3),
  description: z.string().trim().min(10),
  category: dealDtoSchema.shape.category,
  priceCents: z.number().int().positive(),
  status: dealStatusSchema,
  partnerId: z.string().min(1),
  startsAt: z.iso.datetime(),
  endsAt: z.iso.datetime(),
}).refine(
  (payload) => new Date(payload.endsAt).getTime() > new Date(payload.startsAt).getTime(),
  { message: "End date must be after the start date.", path: ["endsAt"] },
);

export const createDealStatusSchema = z.enum(["draft", "pending"]);

export const createDealFormSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters."),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters."),
    category: dealDtoSchema.shape.category,
    price: z
      .string()
      .trim()
      .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price with up to 2 decimals.")
      .refine((value) => Number(value) > 0, "Price must be greater than zero."),
    status: createDealStatusSchema,
    partnerId: z.string().min(1, "Select a partner."),
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
    title: z.string().trim().min(3),
    description: z.string().trim().min(10),
    category: dealDtoSchema.shape.category,
    priceCents: z.number().int().positive(),
    status: createDealStatusSchema,
    partnerId: z.string().min(1),
    startsAt: z.iso.datetime(),
    endsAt: z.iso.datetime(),
  })
  .refine(
    (payload) =>
      new Date(payload.endsAt).getTime() > new Date(payload.startsAt).getTime(),
    { message: "End date must be after the start date.", path: ["endsAt"] },
  );
