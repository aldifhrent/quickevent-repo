import * as z from "zod";

export const transactionSchema = z.object({
  name: z.string(),
  email: z.string(),
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(10, "Quantity must be at most 10")
    .default(1),
  totalAmount: z.coerce.number(),
  paymentProof: z.string(),
});

export type organizerValues = z.infer<typeof transactionSchema>;
