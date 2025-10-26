import { z } from "zod";

export const manualContactSchema = z.object({
  name: z.string()
    .min(1, "validation.nameRequired")
    .max(100, "validation.nameMaxLength")
    .trim(),
  countryCode: z.string()
    .min(1, "validation.countryCodeRequired"),
  phoneNumber: z.string()
    .min(10, "validation.phoneInvalid")
    .max(15, "validation.phoneInvalid")
    .regex(/^\d+$/, "validation.phoneNumeric")
});

export type ManualContactFormData = z.infer<typeof manualContactSchema>;
