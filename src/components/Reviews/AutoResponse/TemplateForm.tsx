import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Star } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface TemplateFormProps {
  onSave: (starRating: number, content: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const { t } = useI18nNamespace("Reviews/templateForm");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (selectedRating && content.trim()) {
      onSave(selectedRating, content.trim());
    }
  };

  const isValid = selectedRating && content.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <Label
          htmlFor="star-rating"
          className="text-sm font-medium text-gray-700"
        >
          {t("templateForm.labels.starRating")}
        </Label>
        <Select onValueChange={(value) => setSelectedRating(parseInt(value))}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue
              placeholder={t("templateForm.placeholders.selectRating")}
            />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((rating) => (
              <SelectItem key={rating} value={rating.toString()}>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span>
                    {rating !== 1
                      ? t("templateForm.stars_plural", { count: rating })
                      : t("templateForm.stars", { count: rating })}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label
          htmlFor="template-content"
          className="text-sm font-medium text-gray-700"
        >
          {t("templateForm.labels.templateContent")}
        </Label>
        <Textarea
          id="template-content"
          placeholder={t("templateForm.placeholders.templateTextarea")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          {t("templateForm.tips.personalization")}
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          {t("templateForm.buttons.close")}
        </Button>
        <Button onClick={handleSave} disabled={!isValid || isLoading}>
          {isLoading
            ? t("templateForm.buttons.saving")
            : t("templateForm.buttons.save")}
        </Button>
      </div>
    </div>
  );
};
