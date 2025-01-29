import * as z from "zod";

export const registerSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export type registerValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type loginValues = z.infer<typeof loginSchema>;
