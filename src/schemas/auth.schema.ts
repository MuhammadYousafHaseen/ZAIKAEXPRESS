import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email()
    .max(254),

  password: z
    .string()
    .min(1)
    .max(128),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(80),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email()
    .max(254),

  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .max(128),

  phone: z
    .string()
    .trim()
    .max(30)
    .optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;