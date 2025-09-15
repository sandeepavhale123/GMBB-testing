import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Edit, RotateCcw } from "lucide-react";
import { CTASection } from "@/modules/lead-module/public-reports/components/CTASection";
import { CTAEditModal } from "./CTAEditModal";
import { useCTASettings } from "@/hooks/useCTASettings";
import { useToast } from "@/hooks/use-toast";

export const CTACustomizationWrapper: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { settings, updateSettings, resetToDefaults, isLoading } = useCTASettings();
  const { toast } = useToast();

  const handleResetToDefaults = () => {
    resetToDefaults();
    toast({
      title: "CTA Reset",
      description: "CTA settings have been reset to defaults.",
    });
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">CTA Customization</h1>
            <p className="text-muted-foreground">Customize your call-to-action section for lead reports.</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToDefaults}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit CTA
            </Button>
          </div>
        </div>

        {/* CTA Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Preview</h2>
            <span className="text-sm text-muted-foreground">
              This is how your CTA will appear in lead reports
            </span>
          </div>
          
          <div className="">
            <CTASection settings={settings} isPreview={true} />
          </div>
        </div>


        {/* Edit Modal */}
        <CTAEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentSettings={settings}
          onSave={updateSettings}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};