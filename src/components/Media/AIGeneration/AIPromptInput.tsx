import React from "react";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface AIPromptInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  maxLength?: number;
}
export const AIPromptInput: React.FC<AIPromptInputProps> = ({
  prompt,
  onPromptChange,
  maxLength = 200,
}) => {
  const { t } = useI18nNamespace("Media/aiPromptInput");
  return (
    <div className="space-y-2">
      <Label htmlFor="ai-prompt" className="text-sm font-medium text-gray-900">
        {t("aiPromptInput.label")}
      </Label>
      <Textarea
        id="ai-prompt"
        placeholder={t("aiPromptInput.placeholder")}
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        maxLength={maxLength}
        className="w-full min-h-[50px] text-base resize-none"
      />
      <p className="text-xs text-gray-500">
        {t("aiPromptInput.hint", { count: prompt.length, max: maxLength })}
        {/* Be specific and descriptive • {prompt.length}/{maxLength} characters */}
      </p>
    </div>
  );
};
