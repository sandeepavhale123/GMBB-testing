import React from "react";
import { Button } from "../ui/button";
import { PasswordInput } from "./PasswordInput";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface CurrentPasswordFormProps {
  currentPassword: string;
  setCurrentPassword: (password: string) => void;
  showCurrentPassword: boolean;
  toggleCurrentPasswordVisibility: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isVerifying: boolean;
}

export const CurrentPasswordForm: React.FC<CurrentPasswordFormProps> = ({
  currentPassword,
  setCurrentPassword,
  showCurrentPassword,
  toggleCurrentPasswordVisibility,
  onSubmit,
  onCancel,
  isVerifying,
}) => {
  const { t } = useI18nNamespace("Profile/currentPasswordForm");
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PasswordInput
        id="currentPassword"
        label={t("form.label")}
        value={currentPassword}
        onChange={setCurrentPassword}
        placeholder={t("form.placeholder")}
        showPassword={showCurrentPassword}
        onToggleVisibility={toggleCurrentPasswordVisibility}
        required
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          {t("buttons.cancel")}
        </Button>
        <Button
          type="submit"
          disabled={isVerifying || !currentPassword}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          {isVerifying ? t("buttons.verifying") : t("buttons.verify")}
        </Button>
      </div>
    </form>
  );
};
