import { z } from "zod";

// Email validation
const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

// Strong password validation
const passwordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

// Name fields should only contain letters and spaces
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters long")
  .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces");

// Signup form validation schema
export const signupSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  agencyName: z
    .string()
    .min(1, "Agency name is required")
    .regex(
      /^[A-Za-z0-9\s]+$/,
      "Agency name can only contain letters, numbers, and spaces"
    ),
  email: emailSchema,
  password: passwordSchema,
  plan: z.string().refine((val) => val !== "0", "Please select a plan"),
});

// Login form validation schema
export const loginSchema = z.object({
  username: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// Profile form validation schema (for future use)
export const profileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  timezone: z.string().min(1, "Timezone is required"),
  language: z.string().min(1, "Language is required"),
  dashboardType: z.string().min(1, "Dashboard type is required"),
});

// Business info validation schema
export const businessInfoSchema = z.object({
  businessName: z
    .string()
    .min(1, "Business name is required")
    .min(2, "Business name must be at least 2 characters long"),
  website: z
    .string()
    .optional()
    .refine(
      (val: string) =>
        !val ||
        val.trim() === "" ||
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/.test(val),

      "Please enter a valid URL"
    ),
  email: emailSchema,
  timezone: z.string().min(1, "Please select a timezone"),
  businessType: z.string().min(1, "Please select what best describes you"),
  locationCount: z.string().optional(),
});
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset password validation schema
export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Types derived from schemas
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
