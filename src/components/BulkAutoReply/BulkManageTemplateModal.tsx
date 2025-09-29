import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Star } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface Template {
  id: string;
  starRating: number;
  content: string;
  enabled: boolean;
  isRatingOnly?: boolean;
}
interface BulkManageTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
  onSave: (template: Template) => void;
}
export const BulkManageTemplateModal: React.FC<
  BulkManageTemplateModalProps
> = ({ open, onOpenChange, template, onSave }) => {
  const { t } = useI18nNamespace("BulkAutoReply/bulkManageTemplateModal");
  const [content, setContent] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (template) {
      setContent(template.content || "");
      setEnabled(template.enabled);
    }
  }, [template]);
  const renderStars = (rating: number) => {
    return Array.from(
      {
        length: 5,
      },
      (_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${
            index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      )
    );
  };
  const handleSave = async () => {
    if (!template) return;
    setIsSaving(true);
    try {
      const updatedTemplate = {
        ...template,
        content,
        enabled,
      };
      await onSave(updatedTemplate);
    } catch (error) {
      console.error("Error saving template:", error);
    } finally {
      setIsSaving(false);
    }
  };
  if (!template) return null;
  const isNewTemplate = !template.id;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>
              {isNewTemplate ? t("title.create") : t("title.manage")}{" "}
              {template.isRatingOnly
                ? t("title.ratingOnly")
                : t("title.review")}{" "}
              {t("title.template")}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold">{template.starRating}</span>
              <div className="flex">{renderStars(template.starRating)}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Panel - Variables Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {t("availableVariables")}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="bg-gray-50 p-2 rounded font-mono">
                  {"{full_name}"}
                </div>
                <div className="bg-gray-50 p-2 rounded font-mono">
                  {"{first_name}"}
                </div>
                <div className="bg-gray-50 p-2 rounded font-mono">
                  {"{last_name}"}
                </div>
                <div className="bg-gray-50 p-2 rounded font-mono">
                  {"{business_name}"}
                </div>
                <div className="bg-gray-50 p-2 rounded font-mono">
                  {"{review_content}"}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">
                {t("multipleResponses.title")}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {t("multipleResponses.description")}
              </p>
              <div className="bg-gray-50 p-2 rounded text-sm font-mono">
                {t("multipleResponses.example")}
              </div>
            </div>
          </div>

          {/* Right Panel - Template Content */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                {t("templateContent")}
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] resize-y"
                placeholder={
                  template.isRatingOnly
                    ? t("placeholder.ratingOnly")
                    : t("placeholder.review")
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("usageInfo", {
                  stars: template.starRating,
                  type: template.isRatingOnly ? "rating-only" : "review",
                })}
                {/* This template will be used for {template.starRating}-star{" "}
                {template.isRatingOnly ? "rating-only" : "review"} responses. */}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            {t("buttons.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !content.trim()}>
            {isSaving
              ? t("buttons.saving")
              : isNewTemplate
              ? t("buttons.createTemplate")
              : t("buttons.saveChanges")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
