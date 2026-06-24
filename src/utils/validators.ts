import z from "zod";

export const confirmReservationSchema = z
  .object({
    fullname: z
      .string()
      .min(1, "Full name is required")
      .refine((val) => val.trim().length > 0, {
        message: "Full name cannot be empty",
      }),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^0\d{10}$/, "Must start with 0 followed by 10 digits (total 11 digits)"),
    delivery: z.enum(["pickup", "delivery"]),
    location: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.delivery === "delivery") {
      if (!data.location || data.location.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Location/Address is required for delivery",
          path: ["location"],
        });
      }
    }
  });

export type ConfirmReservationFormValues = z.infer<typeof confirmReservationSchema>;

export const verifyReservationSchema = z.object({
  fullname: z
    .string()
    .min(1, "Full name is required")
    .refine((val) => val.trim().length > 0, {
      message: "Full name cannot be empty",
    }),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^0\d{10}$/, "Must start with 0 followed by 10 digits (total 11 digits)"),
});

export type VerifyReservationFormValues = z.infer<typeof verifyReservationSchema>;
