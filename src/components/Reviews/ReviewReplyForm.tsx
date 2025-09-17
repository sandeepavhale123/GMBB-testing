import React, { useState } from "react";
import { Button } from "../ui/button";
import { Bot } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ReviewReplyFormProps {
  initialText: string;
  isLoading: boolean;
  onSave: (text: string) => void;
  onCancel: () => void;
  onGenerateAI?: () => void;
}

export const ReviewReplyForm: React.FC<ReviewReplyFormProps> = ({
  initialText,
  isLoading,
  onSave,
  onCancel,
  onGenerateAI,
}) => {
  const { t } = useI18nNamespace("Reviews/reviewReplyForm");
  const [replyText, setReplyText] = useState(initialText);

  const handleSave = () => {
    onSave(replyText);
  };

  return (
    <div className="mb-4">
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder={t("reviewReplyForm.placeholder")}
        className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        rows={3}
      />
      <div className="flex flex-wrap gap-2 mt-3">
        {onGenerateAI && (
          <Button
            size="sm"
            variant="outline"
            onClick={onGenerateAI}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <Bot className="w-4 h-4" />
            {t("reviewReplyForm.buttons.generate")}
          </Button>
        )}
        <Button size="sm" onClick={handleSave} disabled={isLoading}>
          {isLoading
            ? t("reviewReplyForm.buttons.sending")
            : t("reviewReplyForm.buttons.save")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          {t("reviewReplyForm.buttons.cancel")}
        </Button>
      </div>
    </div>
  );
};
