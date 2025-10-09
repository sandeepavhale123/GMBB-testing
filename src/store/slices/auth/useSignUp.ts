import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { signupSchema, SignupFormData } from "@/schemas/authSchemas";
import { useFormValidation } from "@/hooks/useFormValidation";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

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
  const { validate } = useFormValidation(signupSchema);

  const signup = async (signupData: SignupFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const validation = validate(signupData);
    if (!validation.isValid) {
      setIsLoading(false);
      toast({
        title: "Validation Error",
        description: "Please check your form data and try again.",
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

      // console.log("📤 Sending signup request to /signup", payload);

      const response = await fetch(
        "https://api.gmbbriefcase.com/apiv2/v1/signup",
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
      // console.log("✅ Signup response:", data);

      if (data.id) {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe failed to initialize");

        const { error } = await stripe.redirectToCheckout({
          sessionId: data.id,
        });

        if (error) throw new Error(error.message);
        return true;
      } else if (data.url) {
        window.location.href = data.url;
        return true;
      } else {
        throw new Error("No checkout session or URL received");
      }
    } catch (error: any) {
      console.error("❌ Signup failed:", error);

      let errorMessage = "Failed to create account. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid signup data. Please check your information.";
      } else if (error.response?.status === 409) {
        errorMessage = "An account with this email already exists.";
      } else if (error.message === "Network Error") {
        errorMessage = "Network error. Please check your connection.";
      }

      setError(errorMessage);
      toast({
        title: "Signup Failed",
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
