import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface TitleFormData {
  title: string;
  postType: string;
}

interface TitleFieldProps {
  formData: TitleFormData;
  onFormDataChange: (updater: (prev: TitleFormData) => TitleFormData) => void;
  error?: string;
}

export const TitleField: React.FC<TitleFieldProps> = ({
  formData,
  onFormDataChange,
  error,
}) => {
  const { t } = useI18nNamespace("Post/titleField");
  if (formData.postType !== "event" && formData.postType !== "offer") {
    return null;
  }

  const characterCount = formData.title.length;
  const maxLength = 60;

  return (
    <div className="space-y-2">
      <Label
        htmlFor="title"
        className={`text-sm font-medium ${error ? "text-red-600" : ""}`}
      >
        {t("titleField.label")}{" "}
        <span className="text-red-500">
          {t("titleField.requiredIndicator")}
        </span>
      </Label>
      <div className="relative">
        <Input
          id="field-title"
          value={formData.title}
          onChange={(e) =>
            onFormDataChange((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder={t("titleField.placeholder")}
          className={`transition-all focus:ring-2 pr-16 ${
            error ? "border-red-500 focus:ring-red-500" : ""
          }`}
          maxLength={maxLength}
        />
        <div className="absolute top-2 right-3 text-xs text-gray-500">
          {characterCount}/{maxLength}
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
