import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  SingleCTASettings,
  singleCTASettingsSchema,
} from "@/hooks/useCTASettings";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface CTAEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: SingleCTASettings;
  onSave: (settings: SingleCTASettings) => Promise<boolean>;
  isLoading: boolean;
  ctaType: "call" | "appointment";
}
export const CTAEditModal: React.FC<CTAEditModalProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSave,
  isLoading,
  ctaType,
}) => {
  const { t } = useI18nNamespace("Laed-module-component/CTAEditModal");
  const [formData, setFormData] = useState<SingleCTASettings>(() => {
    // Initialize with safe defaults to prevent undefined errors
    return (
      currentSettings || {
        header: t("ctaModal.default.header"),
        description: t("ctaModal.default.description"),
        buttonLabel: t("ctaModal.default.buttonLabel"),
        buttonLink: t("ctaModal.default.buttonLinkLabel"),
        isVisible: true,
      }
    );
  });
  const { validate, getFieldError, hasFieldError, clearErrors } =
    useFormValidation(singleCTASettingsSchema);
  const { toast } = useToast();

  // Reset form when modal opens only
  useEffect(() => {
    if (isOpen) {
      // Ensure all required fields exist with defaults - handle undefined currentSettings
      const settingsWithDefaults = {
        header: currentSettings?.header || t("ctaModal.default.header"),
        description:
          currentSettings?.description || t("ctaModal.default.description"),
        buttonLabel:
          currentSettings?.buttonLabel || t("ctaModal.default.buttonLabel"),
        buttonLink:
          currentSettings?.buttonLink || t("ctaModal.default.buttonLinkLabel"),
        isVisible: currentSettings?.isVisible ?? true,
      };
      setFormData(settingsWithDefaults);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentSettings]);
  const handleInputChange = (
    field: keyof SingleCTASettings,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSave = async () => {
    const validation = validate(formData);
    if (!validation.isValid) {
      toast({
        title: t("ctaModal.toast.validationTitle"),
        description: t("ctaModal.toast.validationDescription"),
        variant: "destructive",
      });
      return;
    }
    const success = await onSave(formData);
    if (success) {
      toast({
        title: t("ctaModal.toast.saveSuccessTitle"),
        description: t("ctaModal.toast.saveSuccessDescription"),
      });
      onClose();
    } else {
      toast({
        title: t("ctaModal.toast.saveFailTitle"),
        description: t("ctaModal.toast.saveFailDescription"),
        variant: "destructive",
      });
    }
  };
  const handleCancel = () => {
    setFormData(
      currentSettings || {
        header: t("ctaModal.default.header"),
        description: t("ctaModal.default.description"),
        buttonLabel: t("ctaModal.default.buttonLabel"),
        buttonLink: t("ctaModal.default.buttonLinkLabel"),
        isVisible: true,
      }
    );
    clearErrors();
    onClose();
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t(
              `ctaModal.editTitle${ctaType === "call" ? "Call" : "Appointment"}`
            )}
            {/* Edit {ctaType === "call" ? "Call" : "Appointment"} CTA Settings */}
          </DialogTitle>
          <DialogDescription>{t("ctaModal.editDescription")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Visibility Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isVisible">{t("ctaModal.visibilityLabel")}</Label>
              <p className="text-xs text-muted-foreground">
                {t("ctaModal.visibilityHelp")}
              </p>
            </div>
            <Switch
              id="isVisible"
              checked={formData.isVisible ?? true}
              onCheckedChange={(checked) =>
                handleInputChange("isVisible", checked)
              }
            />
          </div>

          {/* Header Input */}
          <div className="grid gap-2">
            <Label htmlFor="header">{t("ctaModal.headerLabel")}</Label>
            <Input
              id="header"
              autoFocus
              value={formData.header ?? ""}
              onChange={(e) => handleInputChange("header", e.target.value)}
              placeholder={t("ctaModal.headerPlaceholder")}
              className={hasFieldError("header") ? "border-destructive" : ""}
            />
            {hasFieldError("header") && (
              <p className="text-sm text-destructive">
                {getFieldError("header")}
              </p>
            )}
          </div>

          {/* Description Textarea */}
          <div className="grid gap-2">
            <Label htmlFor="description">
              {t("ctaModal.descriptionLabel")}
            </Label>
            <Textarea
              id="description"
              value={formData.description ?? ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder={t("ctaModal.descriptionPlaceholder")}
              className={
                hasFieldError("description") ? "border-destructive" : ""
              }
              rows={4}
            />
            {hasFieldError("description") && (
              <p className="text-sm text-destructive">
                {getFieldError("description")}
              </p>
            )}
          </div>

          {/* Button Label Input */}
          <div className="grid gap-2">
            <Label htmlFor="buttonLabel">{t("ctaModal.buttonLabel")}</Label>
            <Input
              id="buttonLabel"
              value={formData.buttonLabel ?? ""}
              onChange={(e) => handleInputChange("buttonLabel", e.target.value)}
              placeholder={t("ctaModal.buttonPlaceholder")}
              className={
                hasFieldError("buttonLabel") ? "border-destructive" : ""
              }
            />
            {hasFieldError("buttonLabel") && (
              <p className="text-sm text-destructive">
                {getFieldError("buttonLabel")}
              </p>
            )}
          </div>

          {/* Button Link Input */}
          <div className="grid gap-2">
            <Label htmlFor="buttonLink">{t("ctaModal.buttonLinkLabel")}</Label>
            <Input
              id="buttonLink"
              type="text"
              value={formData.buttonLink ?? ""}
              onChange={(e) => handleInputChange("buttonLink", e.target.value)}
              placeholder={t("ctaModal.buttonLinkPlaceholder")}
              className={
                hasFieldError("buttonLink") ? "border-destructive" : ""
              }
            />
            {hasFieldError("buttonLink") && (
              <p className="text-sm text-destructive">
                {getFieldError("buttonLink")}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {t("ctaModal.buttonLinkHelp")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {t("ctaModal.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? t("ctaModal.saving") : t("ctaModal.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
