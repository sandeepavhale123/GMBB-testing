import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Edit, RotateCcw } from "lucide-react";
import { DualCTASection } from "./DualCTASection";
import { CTAEditModal } from "./CTAEditModal";
import { SingleCTASettings } from "@/hooks/useCTASettings";
import { useCTASettings } from "@/hooks/useCTASettings";
import { useToast } from "@/hooks/use-toast";

export const CTACustomizationWrapper: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCTAType, setEditingCTAType] = useState<'call' | 'appointment'>('call');
  const { settings, updateSingleCTA, resetToDefaults, resetSingleCTA, isLoading } = useCTASettings();
  const { toast } = useToast();

  const handleResetToDefaults = () => {
    resetToDefaults();
    toast({
      title: "CTA Reset",
      description: "CTA settings have been reset to defaults.",
    });
  };

  const handleEditCTA = (ctaType: 'call' | 'appointment') => {
    setEditingCTAType(ctaType);
    setIsEditModalOpen(true);
  };

  const handleSaveCTA = async (newSettings: SingleCTASettings) => {
    const ctaKey = editingCTAType === 'call' ? 'callCTA' : 'appointmentCTA';
    const success = await updateSingleCTA(ctaKey, newSettings);
    if (success) {
      toast({
        title: "CTA Updated",
        description: `${editingCTAType === 'call' ? 'Call' : 'Appointment'} CTA has been updated successfully.`,
      });
      setIsEditModalOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to update CTA settings. Please try again.",
        variant: "destructive",
      });
    }
    return success;
  };

  const handleResetCTA = async () => {
    const ctaKey = editingCTAType === 'call' ? 'callCTA' : 'appointmentCTA';
    return await resetSingleCTA(ctaKey);
  };

  const handleResetSingleCTA = async (ctaType: 'call' | 'appointment') => {
    const ctaKey = ctaType === 'call' ? 'callCTA' : 'appointmentCTA';
    const success = await resetSingleCTA(ctaKey);
    if (success) {
      toast({
        title: "CTA Reset",
        description: `${ctaType === 'call' ? 'Call' : 'Appointment'} CTA has been reset to defaults.`,
      });
    } else {
      toast({
        title: "Error", 
        description: "Failed to reset CTA settings. Please try again.",
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
            <h1 className="text-2xl font-bold text-foreground">CTA Customization</h1>
            <p className="text-muted-foreground">Customize your call-to-action section for lead reports.</p>
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
            <DualCTASection 
              settings={settings} 
              onEditCall={() => handleEditCTA('call')}
              onEditAppointment={() => handleEditCTA('appointment')}
              isPreview={true} 
            />
          </div>
        </div>


        {/* Edit Modal */}
        <CTAEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentSettings={settings?.[editingCTAType === 'call' ? 'callCTA' : 'appointmentCTA'] || {
            header: "BOOST YOUR GBP SCORE &&& Increase your calls",
            description: "Learn how to pay your employees a month's salary by simply fixing what's broken. Get your free blueprint to crush your competition!",
            buttonLabel: "BOOK A CALL",
            buttonLink: "#contact",
            isVisible: true,
          }}
          onSave={handleSaveCTA}
          onReset={handleResetCTA}
          isLoading={isLoading}
          ctaType={editingCTAType}
        />
      </div>
    </div>
  );
};