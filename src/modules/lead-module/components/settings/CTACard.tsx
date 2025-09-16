import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Phone, Calendar, RotateCcw } from "lucide-react";
import { SingleCTASettings } from "@/hooks/useCTASettings";

interface CTACardProps {
  type: 'call' | 'appointment';
  settings: SingleCTASettings;
  onEdit: () => void;
  onReset: () => void;
  isPreview?: boolean;
}

export const CTACard: React.FC<CTACardProps> = ({ 
  type, 
  settings, 
  onEdit, 
  onReset,
  isPreview = false 
}) => {
  const Icon = type === 'call' ? Phone : Calendar;
  
  const handleButtonClick = (e: React.MouseEvent) => {
    if (isPreview || !settings.buttonLink) {
      e.preventDefault();
      return;
    }
    
    if (settings.buttonLink.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(settings.buttonLink);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div 
      className="relative p-6 rounded-lg overflow-hidden"
      style={{ backgroundColor: settings.backgroundColor, color: settings.textColor }}
    >
      {/* Action Buttons */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="h-8 w-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
          style={{ color: settings.textColor }}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
          style={{ color: settings.textColor }}
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div 
            className="w-16 h-16 rounded-lg flex items-center justify-center"
            style={{ backgroundColor:'#EF4444' }}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-2 leading-tight">
            {settings.header}
          </h3>
          <p className="text-sm leading-relaxed opacity-90 mb-4 md:mb-0">
            {settings.description}
          </p>
        </div>

        {/* Button */}
        <div className="flex-shrink-0">
          {settings.buttonLink ? (
            <a
              href={isPreview ? undefined : settings.buttonLink}
              onClick={handleButtonClick}
              className="inline-block"
              target={settings.buttonLink.startsWith('http') ? '_blank' : undefined}
              rel={settings.buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <Button 
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2 rounded-md transition-colors"
              >
                {settings.buttonLabel}
              </Button>
            </a>
          ) : (
            <Button 
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2 rounded-md transition-colors"
              onClick={handleButtonClick}
            >
              {settings.buttonLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};