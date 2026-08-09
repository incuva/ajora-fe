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
    payment_option: z.enum(["online", "onsite"]),
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

// Admin auth schemas

export const adminLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export const adminSignupSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^0\d{10}$/, "Must start with 0 followed by 10 digits (total 11 digits)"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AdminSignupFormValues = z.infer<typeof adminSignupSchema>;

/** POST /admin/new — super-admin creating another admin. */
export const createAdminSchema = adminSignupSchema.extend({
  role: z.enum(["admin", "super-admin"]).default("admin"),
});

export type CreateAdminFormValues = z.infer<typeof createAdminSchema>;

// Admin pool schemas

const poolStatusEnum = z.enum(["open", "closed", "filled"]);

const createSubpoolSchema = z.object({
  name: z.string().min(1, "Subpool name is required"),
  total_slots: z.coerce.number().int().positive("Total slots must be greater than 0"),
  description: z.string().optional(),
  price: z.coerce.number().nonnegative().optional(),
});

/** POST /admin/pool/create */
export const createPoolSchema = z.object({
  name: z.string().min(1, "Pool name is required"),
  description: z.string().optional(),
  total_slots: z.coerce.number().int().positive("Total slots must be greater than 0"),
  slot_price: z.coerce.number().positive("Slot price must be greater than 0"),
  imageUrl: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
  total_value: z.coerce.number().positive("Total value must be greater than 0"),
  subpools: z.array(createSubpoolSchema).optional(),
});

export type CreatePoolFormValues = z.infer<typeof createPoolSchema>;

/** PUT /admin/pool/{id} — all fields optional (partial update). */
export const updatePoolSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  total_slots: z.coerce.number().int().positive().optional(),
  slot_price: z.coerce.number().positive().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  total_value: z.coerce.number().positive().optional(),
  weight_per_slot: z.coerce.number().nonnegative().optional(),
  status: poolStatusEnum.optional(),
});

export type UpdatePoolFormValues = z.infer<typeof updatePoolSchema>;

/** POST /admin/subpool/add/{poolId} */
export const addSubpoolSchema = z.object({
  name: z.string().min(1, "Subpool name is required"),
  description: z.string().optional(),
  weight_per_slot: z.coerce.number().nonnegative().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  total_slots: z.coerce.number().int().positive("Total slots must be greater than 0"),
  status: poolStatusEnum.optional(),
});

export type AddSubpoolFormValues = z.infer<typeof addSubpoolSchema>;

/** PUT /admin/subpool/{id} — all fields optional (partial update). */
export const updateSubpoolSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  total_slots: z.coerce.number().int().positive().optional(),
  weight_per_slot: z.coerce.number().nonnegative().optional(),
  status: poolStatusEnum.optional(),
});

export type UpdateSubpoolFormValues = z.infer<typeof updateSubpoolSchema>;
