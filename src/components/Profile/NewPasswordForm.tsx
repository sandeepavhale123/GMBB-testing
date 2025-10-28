import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { PasswordInput } from "./PasswordInput";
import { useFormValidation } from "../../hooks/useFormValidation";
import { z } from "zod";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface NewPasswordFormProps {
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  toggleNewPasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isUpdating: boolean;
}

export const NewPasswordForm: React.FC<NewPasswordFormProps> = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showNewPassword,
  showConfirmPassword,
  toggleNewPasswordVisibility,
  toggleConfirmPasswordVisibility,
  onSubmit,
  onBack,
  isUpdating,
}) => {
  const { t } = useI18nNamespace("Profile/newPasswordForm");

  const passwordSchema = z
    .string()
    .trim()
    .min(8, t("validation.min"))
    .regex(/[A-Z]/, t("validation.uppercase"))
    .regex(/[a-z]/, t("validation.lowercase"))
    .regex(/[0-9]/, t("validation.number"))
    .regex(/[^A-Za-z0-9]/, t("validation.character"));

  const confirmPasswordSchema = z
    .object({
      newPassword: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.message"),
      path: ["confirmPassword"],
    });

  const { validate, getFieldError, hasFieldError, clearFieldError } =
    useFormValidation(confirmPasswordSchema);

  // Validate on password change
  useEffect(() => {
    if (newPassword || confirmPassword) {
      validate({ newPassword, confirmPassword });
    }
  }, [newPassword, confirmPassword]);

  const newPasswordError = getFieldError("newPassword");
  const confirmPasswordError = getFieldError("confirmPassword");
  const isFormValid =
    !hasFieldError("newPassword") &&
    !hasFieldError("confirmPassword") &&
    newPassword &&
    confirmPassword;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <PasswordInput
          id="newPassword"
          label={t("form.newPassword")}
          value={newPassword}
          onChange={setNewPassword}
          placeholder={t("form.newPasswordPlaceholder")}
          showPassword={showNewPassword}
          onToggleVisibility={toggleNewPasswordVisibility}
          required
        />
        {newPasswordError && (
          <p className="text-sm text-red-600 mt-1">{newPasswordError}</p>
        )}
      </div>

      <div>
        <PasswordInput
          id="confirmPassword"
          label={t("form.confirmPassword")}
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder={t("form.confirmPasswordPlaceholder")}
          showPassword={showConfirmPassword}
          onToggleVisibility={toggleConfirmPasswordVisibility}
          required
        />
        {confirmPasswordError && (
          <p className="text-sm text-red-600 mt-1">{confirmPasswordError}</p>
        )}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>{t("form.requirementsTitle")}</p>
        <ul className="list-disc list-inside space-y-1">
          <li className={newPassword.length >= 8 ? "text-green-600" : ""}>
            {t("form.requirementLength")}
          </li>
          <li
            className={
              /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)
                ? "text-green-600"
                : ""
            }
          >
            {t("form.requirementCase")}
          </li>
          <li className={/[0-9]/.test(newPassword) ? "text-green-600" : ""}>
            {t("form.requirementNumber")}
          </li>
          <li
            className={/[^A-Za-z0-9]/.test(newPassword) ? "text-green-600" : ""}
          >
            {t("form.requirementSpecial")}
          </li>
        </ul>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          {t("buttons.back")}
        </Button>
        <Button
          type="submit"
          disabled={isUpdating || !isFormValid}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          {isUpdating ? t("buttons.updating") : t("buttons.update")}
        </Button>
      </div>
    </form>
  );
};
