import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { loadStripe } from "@stripe/stripe-js";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { z } from "zod";

interface StripeSignupResponse {
  success: boolean;
  sessionUrl?: string;
  sessionId?: string;
  id?: string;
  url?: string;
  message?: string;
}

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { t } = useI18nNamespace(["hooks/useSignUp", "Validation/validation"]);

  const nameSchema = z
    .string()
    .min(2, t("name.minLength"))
    .regex(/^[A-Za-z\s]+$/, t("name.lettersOnly"))
    .refine(
      (val) => (val.match(/[A-Za-z]/g) || []).length >= 3,
      t("name.minAlphabetic")
    );

  const signupSchema = z.object({
    firstName: nameSchema,
    lastName: nameSchema,
    agencyName: z
      .string()
      .min(3, t("agency.minLength"))
      .refine(
        (val) => (val.match(/[A-Za-z]/g) || []).length >= 3,
        t("agency.minAlphabetic")
      ),
    email: z
      .string()
      .trim()
      .min(1, t("email.required"))
      .email(t("email.invalid")),
    password: z
      .string()
      .trim()
      .min(8, t("password.minLength"))
      .regex(/[A-Z]/, t("password.uppercase"))
      .regex(/[a-z]/, t("password.lowercase"))
      .regex(/[0-9]/, t("password.number"))
      .regex(/[^A-Za-z0-9]/, t("password.specialChar")),
    plan: z.string().refine((val) => val !== "0", t("plan.required")),
  });

  type SignupFormData = z.infer<typeof signupSchema>;

  const { validate } = useFormValidation(signupSchema);

  const signup = async (signupData: SignupFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const validation = validate(signupData);
    if (!validation.isValid) {
      setIsLoading(false);
      toast({
        title: t("toast.validationError.title"),
        description: t("toast.validationError.description"),
        variant: "destructive",
      });
      return false;
    }

    try {
      const payload = {
        firstName: validation.data!.firstName,
        lastName: validation.data!.lastName,
        userEmail: validation.data!.email,
        userPassword: validation.data!.password,
        agencyName: validation.data!.agencyName,
        planId: parseInt(validation.data!.plan),
        successUrl: `${window.location.origin}/verify-signup`,
        cancelUrl: `${window.location.origin}/signup`,
      };

      const response = await fetch(
        "https://api.gmbbriefcase.com/api/v1/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          response: {
            status: response.status,
            data: errorData,
          },
        };
      }

      const data: StripeSignupResponse = await response.json();

      if (data.id) {
        // Lazy load Stripe only when needed
        const stripe = await loadStripe(
          import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
        );
        if (!stripe) throw new Error(t("errors.stripeInit"));

        const { error } = await stripe.redirectToCheckout({
          sessionId: data.id,
        });

        if (error) throw new Error(error.message);
        return true;
      } else if (data.url) {
        window.location.href = data.url;
        return true;
      } else {
        throw new Error(t("errors.noSessionUrl"));
      }
    } catch (error: any) {
      console.error("❌ Signup failed:", error);

      let errorMessage = t("errors.failed");
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = t("errors.invalidData");
      } else if (error.response?.status === 409) {
        errorMessage = t("errors.accountExists");
      } else if (error.message === "Network Error") {
        errorMessage = t("errors.network");
      }

      setError(errorMessage);
      toast({
        title: t("toast.signupFailed.title"),
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signup,
    isLoading,
    error,
  };
};
