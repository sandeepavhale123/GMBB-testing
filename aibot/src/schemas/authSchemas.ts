import { z } from "zod";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
// Email validation
const emailSchema = z.string().trim().min(1, "Email is required").email("Please enter a valid email address");

// Strong password validation
const passwordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

// Name fields should only contain letters and spaces
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters long")
  .regex(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
  .refine((val) => (val.match(/[A-Za-z]/g) || []).length >= 3, "Name must contain at least 3 alphabetic characters");

// Signup form validation schema
export const signupSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  agencyName: z
    .string()
    .min(3, "Agency name must be 3 characters required")
    .refine((val) => (val.match(/[A-Za-z]/g) || []).length >= 3, "Name must contain at least 3 alphabetic characters"),
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
      (val: string) => !val || val.trim() === "" || /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/.test(val),

      "Please enter a valid URL",
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

// API Key validation schema
export const apiKeySchema = z.object({
  apiKey: z.string().trim().min(1, "API key is required"),
});

// Disconnect confirmation schema
export const disconnectConfirmationSchema = z.object({
  confirmationText: z.string().refine((val) => val.toLowerCase() === "delete", {
    message: "Please type 'delete' to confirm",
  }),
});

// smtp schema
export const smtpSchema = z.object({
  fromName: z
    .string()
    .min(1, "From name is required")
    .refine((val) => (val.match(/[A-Za-z]/g) || []).length >= 3, "Name must contain at least 3 alphabetic characters"),
  rpyEmail: emailSchema,
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.string().min(1, "SMTP port is required").regex(/^\d+$/, "Port must be a number"),
  smtpUser: z.string().min(1, "SMTP user is required"),
  smtpPass: z.string().min(1, "SMTP password is required"),
});

// Geo Ranking keyword schema
export const keywordsSchema = z.object({
  keywords: z
    .string()
    .refine((val) => {
      if (!val.trim()) return false; // Keywords are required
      const keywordArray = val
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
      return keywordArray.length <= 5;
    }, "You can add a maximum of 5 keywords.")
    .refine((val) => {
      const keywordArray = val
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
      return keywordArray.length > 0;
    }, "At least one keyword is required."),
});

// report branding schema
export const reportBrandingSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .min(2, "Company name must be at least 2 characters long")
    .refine((val) => (val.match(/[A-Za-z]/g) || []).length >= 3, "Name must contain at least 3 alphabetic characters"),
  companyEmail: emailSchema,
  companyWebsite: z
    .string()
    .trim()
    .refine(
      (val) => !val || val === "" || /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/.test(val),
      "Please enter a valid URL",
    ),
  companyPhone: z
    .string()
    .trim()
    .min(10, "Phone number must conatin 10 digit")
    .refine(
      (val) => !val || val === "" || /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, "")),
      "Please enter a valid phone number",
    ),
  companyAddress: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters long")
    .refine((val) => !val || val === "" || val.length >= 10, "Address must be at least 10 characters long"),
});

//add team member schema
export const addTeamMemberSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.string().min(1, "Role is required"),
  profilePicture: z.string().optional(),
});

// Types derived from schemas
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
export type DisconnectConfirmationFormData = z.infer<typeof disconnectConfirmationSchema>;
export type SmtpFormData = z.infer<typeof smtpSchema>;
export type KeywordsFormData = z.infer<typeof keywordsSchema>;
export type ReportBrandingFormData = z.infer<typeof reportBrandingSchema>;
export type AddTeamMemberFormData = z.infer<typeof addTeamMemberSchema>;
