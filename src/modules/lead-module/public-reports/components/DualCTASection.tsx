import React from 'react';
import { Button } from "@/components/ui/button";
import { Phone, Calendar } from "lucide-react";
import { useCTASettings } from "@/hooks/useCTASettings";

interface DualCTASectionProps {
  isPreview?: boolean;
}

export const DualCTASection: React.FC<DualCTASectionProps> = ({ 
  isPreview = false 
}) => {
  const { settings } = useCTASettings();

  const handleButtonClick = (e: React.MouseEvent, buttonLink: string) => {
    if (isPreview || !buttonLink) {
      e.preventDefault();
      return;
    }
    
    if (buttonLink.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(buttonLink);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const CTACard = ({ type, ctaSettings }: { type: 'call' | 'appointment', ctaSettings: any }) => {
    const Icon = type === 'call' ? Phone : Calendar;
    
    return (
      <div 
        className="p-6 rounded-lg overflow-hidden"
        style={{ backgroundColor: ctaSettings.backgroundColor, color: ctaSettings.textColor }}
      >
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'hsl(217 91% 45%)' }}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold mb-2 leading-tight">
              {ctaSettings.header}
            </h3>
            <p className="text-sm leading-relaxed opacity-90 mb-4">
              {ctaSettings.description}
            </p>
          </div>

          {/* Button */}
          <div className="flex-shrink-0">
            {ctaSettings.buttonLink ? (
              <a
                href={isPreview ? undefined : ctaSettings.buttonLink}
                onClick={(e) => handleButtonClick(e, ctaSettings.buttonLink)}
                className="inline-block"
                target={ctaSettings.buttonLink.startsWith('http') ? '_blank' : undefined}
                rel={ctaSettings.buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <Button 
                  className="bg-white hover:bg-gray-50 text-primary border border-primary font-semibold px-6 py-2 rounded-md transition-colors"
                >
                  {ctaSettings.buttonLabel}
                </Button>
              </a>
            ) : (
              <Button 
                className="bg-white hover:bg-gray-50 text-primary border border-primary font-semibold px-6 py-2 rounded-md transition-colors"
                onClick={(e) => handleButtonClick(e, ctaSettings.buttonLink)}
              >
                {ctaSettings.buttonLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 my-8">
      {settings.callCTA.isVisible && (
        <CTACard type="call" ctaSettings={settings.callCTA} />
      )}
      {settings.appointmentCTA.isVisible && (
        <CTACard type="appointment" ctaSettings={settings.appointmentCTA} />
      )}
    </div>
  );
};