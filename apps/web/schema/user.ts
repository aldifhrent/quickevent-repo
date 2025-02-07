import * as z from "zod";

export const registerSchema = z
  .object({
    name: z.string(),

    email: z.string().email({ message: "Email tidak valid" }),

    password: z.string(),

    confirmPassword: z.string(),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan Konfirmasi Password harus sama",
    path: ["confirmPassword"],
  });

// export const registerSchema = z.object({
//   name: z
//     .string()
//     .min(3, { message: "Name must be at least 3 characters long" })
//     .max(50, { message: "Name must be no longer than 50 characters" }),

//   email: z
//     .string()
//     .email({ message: "Invalid email address" })
//     .min(6, { message: "Email must be at least 6 characters long" })
//     .max(100, { message: "Email must be no longer than 100 characters" }),

//   password: z
//     .string()
//     .min(8, { message: "Password must be at least 8 characters long" })
//     .regex(/[a-z]/, {
//       message: "Password must contain at least one lowercase letter",
//     })
//     .regex(/[A-Z]/, {
//       message: "Password must contain at least one uppercase letter",
//     })
//     .regex(/[0-9]/, { message: "Password must contain at least one number" })
//     .regex(/[@$!%*?&]/, {
//       message: "Password must contain at least one special character",
//     }),

//   referralCode: z
//     .string()
//     .optional()
// });

export type registerValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type loginValues = z.infer<typeof loginSchema>;

export const changeProfileSchema = z
  .object({
    name: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan Konfirmasi Password harus sama",
    path: ["confirmPassword"],
  });

export type changeProfileValues = z.infer<typeof changeProfileSchema>;
