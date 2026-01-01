import React from "react";
import { Button } from "../../ui/button";
import { Check, Settings, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface BrandingSaveActionsProps {
  isSaving: boolean;
  onSave: () => Promise<void>;
  onReset: () => void;
  canReset: boolean;
}

export const BrandingSaveActions: React.FC<BrandingSaveActionsProps> = ({
  isSaving,
  onSave,
  onReset,
  canReset,
}) => {
  const { t } = useI18nNamespace("Branding/brandingSaveActions");
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await onSave();
      toast({
        title: t("brandingSaveActions.toast.success.title"),
        description: t("brandingSaveActions.toast.success.description"),
      });
    } catch (error) {
      toast({
        title: t("brandingSaveActions.toast.errorSave.title"),
        description:
          error?.response?.data?.message ||
          error.message ||
          t("brandingSaveActions.toast.errorSave.defaultDescription"),
        variant: "destructive",
      });
    }
  };
  const handleReset = async () => {
    try {
      await onReset();
    } catch (error) {
      // Error handling is done in the parent component
      toast({
        title: t("brandingSaveActions.toast.errorReset.title"),
        description:
          error instanceof Error
            ? error.message
            : t("brandingSaveActions.toast.errorReset.defaultDescription"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between flex-col gap-2 sm:flex-row sm:gap-0">
      <Button
        variant="outline"
        onClick={handleReset}
        disabled={isSaving || !canReset}
        className="px-6"
      >
        <RotateCcw className="w-4 h-4 mr-1" />
        {t("brandingSaveActions.buttons.reset")}
      </Button>

      <Button onClick={handleSave} disabled={isSaving} className="px-8">
        {isSaving ? (
          <>
            <Settings className="w-4 h-4 mr-1 animate-spin" />
            {t("brandingSaveActions.buttons.saving")}
          </>
        ) : (
          <>
            <Check className="w-4 h-4 mr-1" />
            {t("brandingSaveActions.buttons.saveChanges")}
          </>
        )}
      </Button>
    </div>
  );
};
