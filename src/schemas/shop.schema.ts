
import { z } from "zod";

export const shopApplicationSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().min(10).max(2000),
    cuisineTypes: z
      .array(z.string().trim().min(2).max(40))
      .max(10)
      .default([]),
    phone: z.string().trim().min(7).max(30),
    address: z.object({
      line1: z.string().trim().min(3).max(200),
      line2: z.string().trim().max(200).optional(),
      city: z.string().trim().min(2).max(100),
      state: z.string().trim().max(100).optional(),
      postalCode: z.string().trim().max(20).optional(),
      country: z.string().trim().min(2).max(100),
    }),
    deliveryRadiusKm: z.coerce.number().min(1).max(100).default(5),
  })
  .strict();

export type ShopApplicationInput = z.infer<
  typeof shopApplicationSchema
>;
