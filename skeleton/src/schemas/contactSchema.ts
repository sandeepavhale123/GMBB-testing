import { z } from "zod";

export const manualContactSchema = z.object({
  firstName: z.string()
    .min(1, "validation.firstNameRequired")
    .max(50, "validation.firstNameMaxLength")
    .trim(),
  lastName: z.string()
    .min(1, "validation.lastNameRequired")
    .max(50, "validation.lastNameMaxLength")
    .trim(),
  countryCode: z.string()
    .min(1, "validation.countryCodeRequired"),
  phoneNumber: z.string()
    .min(10, "validation.phoneInvalid")
    .max(15, "validation.phoneInvalid")
    .regex(/^\d+$/, "validation.phoneNumeric"),
  email: z.string()
    .email("validation.emailInvalid")
    .max(255, "validation.emailMaxLength")
    .optional()
    .or(z.literal(""))
});

export type ManualContactFormData = z.infer<typeof manualContactSchema>;
