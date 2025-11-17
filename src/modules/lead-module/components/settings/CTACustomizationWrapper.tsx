import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, RotateCcw } from "lucide-react";
import { DualCTASection } from "./DualCTASection";
import { CTAEditModal } from "./CTAEditModal";
import { SingleCTASettings } from "@/hooks/useCTASettings";
import { useCTASettings } from "@/hooks/useCTASettings";
import { useToast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const CTACustomizationWrapper: React.FC = () => {
  const { t } = useI18nNamespace(
    "Laed-module-component/CTACustomizationWrapper"
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCTAType, setEditingCTAType] = useState<"call" | "appointment">(
    "call"
  );
  const {
    settings,
    updateSingleCTA,
    resetToDefaults,
    resetSingleCTA,
    isLoading,
  } = useCTASettings();
  const { toast } = useToast();

  const handleResetToDefaults = () => {
    resetToDefaults();
    toast({
      title: t("ctaCustomization.toast.resetTitle"),
      description: t("ctaCustomization.toast.resetDescription"),
    });
  };

  const handleEditCTA = (ctaType: "call" | "appointment") => {
    setEditingCTAType(ctaType);
    setIsEditModalOpen(true);
  };

  const handleSaveCTA = async (newSettings: SingleCTASettings) => {
    const ctaKey = editingCTAType === "call" ? "callCTA" : "appointmentCTA";
    const success = await updateSingleCTA(ctaKey, newSettings);
    if (success) {
      toast({
        title: t("ctaCustomization.toast.updateTitle"),
        description: `${
          editingCTAType === "call"
            ? t("ctaCustomization.toast.updateCallDescription")
            : t("ctaCustomization.toast.updateAppointmentDescription")
        }`,
      });
      setIsEditModalOpen(false);
    } else {
      toast({
        title: t("ctaCustomization.toast.errorTitle"),
        description: t("ctaCustomization.toast.errorDescription"),
        variant: "destructive",
      });
    }
    return success;
  };

  const handleResetSingleCTA = async (ctaType: "call" | "appointment") => {
    const ctaKey = ctaType === "call" ? "callCTA" : "appointmentCTA";
    const success = await resetSingleCTA(ctaKey);
    if (success) {
      toast({
        title: t("ctaCustomization.toast.resetTitle"),
        description: `${
          ctaType === "call"
            ? t("ctaCustomization.toast.resetCallDescription")
            : t("ctaCustomization.toast.resetAppointmentDescription")
        }`,
      });
    } else {
      toast({
        title: t("ctaCustomization.toast.errorTitle"),
        description: t("ctaCustomization.toast.errorDescription"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("ctaCustomization.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("ctaCustomization.subtitle")}
            </p>
          </div>
        </div>

        {/* CTA Preview */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              {" "}
              {t("ctaCustomization.previewTitle")}
            </h2>
            <span className="text-sm text-muted-foreground">
              {t("ctaCustomization.previewDescription")}
            </span>
          </div>

          <div className="">
            <DualCTASection
              settings={settings}
              onEditCall={() => handleEditCTA("call")}
              onEditAppointment={() => handleEditCTA("appointment")}
              onResetCall={() => handleResetSingleCTA("call")}
              onResetAppointment={() => handleResetSingleCTA("appointment")}
              isPreview={true}
            />
          </div>
        </div>

        {/* Edit Modal */}
        <CTAEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentSettings={
            settings?.[
              editingCTAType === "call" ? "callCTA" : "appointmentCTA"
            ] || {
              header: t("ctaCustomization.defaultCTA.header"),
              description: t("ctaCustomization.defaultCTA.description"),
              buttonLabel: t("ctaCustomization.defaultCTA.buttonLabel"),
              buttonLink: "#contact",
              isVisible: true,
            }
          }
          onSave={handleSaveCTA}
          isLoading={isLoading}
          ctaType={editingCTAType}
        />
      </div>
    </div>
  );
};

export default CTACustomizationWrapper;
