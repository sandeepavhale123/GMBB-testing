import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/schemas/authSchemas"; // adjust path as needed
import { useFormValidation } from "@/hooks/useFormValidation";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { z } from "zod";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useI18nNamespace([
    "Login/forgotPasswordModal",
    "Validation/validation",
  ]);

  const forgotPasswordSchema = z.object({
    email: z
      .string()
      .trim()
      .min(1, t("email.required"))
      .email(t("email.invalid")),
  });

  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [isLoading, setIsLoading] = useState(false);

  const {
    validate,
    getFieldError,
    hasFieldError,
    clearErrors,
    clearFieldError,
  } = useFormValidation(forgotPasswordSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = validate(formData);
    if (!result.isValid) return;

    setIsLoading(true);

    try {
      // Simulated API call
      const response = await fetch(`${BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.email,
          domainUrl: `${window.location.origin}/`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: t("errorFoundTitle"),
          description: data.message,
        });
      } else {
        toast({
          title: t("resetLinkSentTitle"),
          description: data.message,
        });
      }
      // Reset form and close modal
      setFormData({ email: "" });
      clearErrors();
      onClose();
    } catch (error) {
      toast({
        title: t("errorTitle"),
        description: error?.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleClose = () => {
    setFormData({ email: "" });
    clearErrors();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {t("forgotPasswordTitle")}
              </DialogTitle>
              <p className="text-gray-600 text-sm">
                {t("forgotPasswordDescription")}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="reset-email" className="text-gray-700">
              {t("emailLabel")}
            </Label>
            <Input
              id="reset-email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("emailPlaceholder")}
              className={`h-12 text-base ${
                hasFieldError("email") ? "border-red-500" : ""
              }`}
              disabled={isLoading}
            />
            {hasFieldError("email") && (
              <p className="text-sm text-red-500">{getFieldError("email")}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoaderCircle className="animate-spin" size={20} />
                {t("sending")}
              </span>
            ) : (
              t("resetPasswordButton")
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleClose}
              className="text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              {t("backToLogin")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
