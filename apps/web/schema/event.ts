import * as z from "zod"

export const eventSchema = z
  .object({
    category: z.string().min(1, "Category is required"),
    title: z.string().min(1, "Title is required"),
    location: z.string(),
    description: z.string().min(1, "Description is required"),
    registrationStartDate: z.date({
      required_error: "Registration start date is required",
    }),
    registrationEndDate: z.date({
      required_error: "Registration end date is required",
    }),
    eventStartDate: z.date({
      required_error: "Event start date is required",
    }),
    eventEndDate: z.date({
      required_error: "Event end date is required",
    }),
    imageUrl: z.instanceof(File).optional(),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    ticketType: z.string().min(1, "Ticket type is required"),
    totalTicket: z.coerce
      .number()
      .min(1, "Total tickets must be at least 1")
      .max(1000000, "Total tickets cannot exceed 1,000,000"),
  })
  .refine(
    (data) => {
      return data.eventEndDate >= data.eventStartDate;
    },
    {
      message: "Event end date must be after start date",
      path: ["eventEndDate"],
    }
  )
  .refine(
    (data) => {
      return data.registrationEndDate >= data.registrationStartDate;
    },
    {
      message: "Registration end date must be after start date",
      path: ["registrationEndDate"],
    }
  )
  .refine(
    (data) => {
      return data.registrationStartDate < data.eventStartDate;
    },
    {
      message: "Registration start date must be before event start date",
      path: ["registrationStartDate"],
    }
  );
