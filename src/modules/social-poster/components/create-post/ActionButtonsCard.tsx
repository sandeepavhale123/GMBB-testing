import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2, RotateCcw, Eye } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ActionButtonsCardProps {
  scheduleEnabled: boolean;
  onReset: () => void;
  onSubmit: () => void;
  onPreview?: () => void;
  isSubmitting: boolean;
  isUploading: boolean;
  editMode?: boolean;
}

export const ActionButtonsCard: React.FC<ActionButtonsCardProps> = ({
  scheduleEnabled,
  onReset,
  onSubmit,
  onPreview,
  isSubmitting,
  isUploading,
  editMode = false,
}) => {
  const { t } = useI18nNamespace([
    "social-poster-components-createpost/ActionButtonsCard",
  ]);
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-2 sm:gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={isSubmitting || isUploading}
            className="flex-1 sm:flex-initial"
          >
            <RotateCcw className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{t("actions.reset")}</span>
          </Button>

          {onPreview && (
            <Button
              type="button"
              variant="outline"
              onClick={onPreview}
              className="flex-1 sm:flex-initial lg:hidden"
            >
              <Eye className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{t("actions.preview")}</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || isUploading}
            className="flex-1 sm:flex-initial"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
                <span className="hidden sm:inline">
                  {editMode ? t("actions.updating") : t("actions.creating")}
                </span>
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  {editMode
                    ? scheduleEnabled
                      ? t("actions.update_schedule")
                      : t("actions.update_post")
                    : scheduleEnabled
                    ? t("actions.schedule")
                    : t("actions.publish_now")}
                </span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
