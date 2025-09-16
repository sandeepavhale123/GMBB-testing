import React from 'react';
import { CTACard } from './CTACard';
import { CTASettings } from "@/hooks/useCTASettings";

interface DualCTASectionProps {
  settings: CTASettings;
  onEditCall: () => void;
  onEditAppointment: () => void;
  isPreview?: boolean;
}

export const DualCTASection: React.FC<DualCTASectionProps> = ({ 
  settings, 
  onEditCall, 
  onEditAppointment, 
  isPreview = false 
}) => {
  return (
    <div className="space-y-4">
      {settings.callCTA.isVisible && (
        <CTACard
          type="call"
          settings={settings.callCTA}
          onEdit={onEditCall}
          isPreview={isPreview}
        />
      )}
      {settings.appointmentCTA.isVisible && (
        <CTACard
          type="appointment"
          settings={settings.appointmentCTA}
          onEdit={onEditAppointment}
          isPreview={isPreview}
        />
      )}
    </div>
  );
};