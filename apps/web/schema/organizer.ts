import { z } from "zod";

export const organizerSchema = z.object({
  organizerName: z.string().min(1, "Company name is required"),
  aboutOrganizer: z.string().optional(),
  website: z.string().optional(),
});

export type organizerValues = z.infer<typeof organizerSchema>;
