import React from 'react';
import { CTACard } from './CTACard';
import { CTASettings } from "@/hooks/useCTASettings";

interface DualCTASectionProps {
  settings: CTASettings;
  onEditCall: () => void;
  onEditAppointment: () => void;
  onResetCall: () => void;
  onResetAppointment: () => void;
  isPreview?: boolean;
}

export const DualCTASection: React.FC<DualCTASectionProps> = ({
  settings,
  onEditCall,
  onEditAppointment,
  onResetCall,
  onResetAppointment,
  isPreview = false
}) => {
  return (
    <div className="space-y-4">
        {settings.callCTA.isVisible && (
          <CTACard
            type="call"
            settings={settings.callCTA}
            onEdit={onEditCall}
            onReset={onResetCall}
            isPreview={isPreview}
          />
        )}
        {settings.appointmentCTA.isVisible && (
          <CTACard
            type="appointment"
            settings={settings.appointmentCTA}
            onEdit={onEditAppointment}
            onReset={onResetAppointment}
            isPreview={isPreview}
          />
        )}
    </div>
  );
};