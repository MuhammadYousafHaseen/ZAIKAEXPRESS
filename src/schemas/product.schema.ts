
import { z } from "zod";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
} from "@/src/types/domain";

const productFields = {
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().min(1).max(3000),
  category: z.enum(PRODUCT_CATEGORIES),
  imageUrls: z
    .array(z.string().url().max(2048))
    .max(10)
    .refine(
      (urls) =>
        urls.every((url) => {
          try {
            const parsed = new URL(url);
            return parsed.protocol === "https:" || parsed.protocol === "http:";
          } catch {
            return false;
          }
        }),
      "Images must use valid HTTP or HTTPS URLs.",
    ),
  price: z.number().int().safe().min(1),
  preparationTimeMinutes: z.number().int().min(0).max(1440),
  tags: z.array(z.string().trim().min(1).max(40)).max(20),
  status: z.enum(PRODUCT_STATUSES),
  isAvailable: z.boolean(),
};

export const createProductSchema = z
  .object(productFields)
  .strict();

export const updateProductSchema = z
  .object(productFields)
  .partial()
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Provide at least one field to update.",
  );
