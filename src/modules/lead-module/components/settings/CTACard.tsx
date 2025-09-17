import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Phone, Calendar, RotateCcw } from "lucide-react";
import { SingleCTASettings } from "@/hooks/useCTASettings";

interface CTACardProps {
  type: 'call' | 'appointment';
  settings: SingleCTASettings;
  onEdit: () => void;
  onReset: () => void;
  isPreview?: boolean;
  disabled?: boolean;
}

export const CTACard: React.FC<CTACardProps> = ({ 
  type, 
  settings, 
  onEdit, 
  onReset,
  isPreview = false,
  disabled = false
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
      className={`relative p-6 rounded-lg overflow-hidden transition-all bg-primary text-primary-foreground ${disabled ? 'opacity-50 grayscale' : ''}`}
    >
      {disabled && (
        <div className="absolute inset-0 bg-black/10 z-10 flex items-center justify-center">
          <div className="bg-black/80 text-white px-3 py-1 rounded-md text-sm font-medium">
            Hidden in Reports
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <TooltipProvider>
        <div className="absolute top-2 right-2 z-20 flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onReset}
                className="h-8 w-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                style={{ color: 'black' }}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset to default</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onEdit}
                className="h-8 w-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                style={{ color: 'black' }}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit CTA</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div 
            className="w-16 h-16 rounded-lg flex items-center justify-center hover:bg-white/30 backdrop-blur-sm"
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
                className="bg-white hover:bg-gray-50 text-primary border border-primary font-semibold px-6 py-2 rounded-md transition-colors"
              >
                {settings.buttonLabel}
              </Button>
            </a>
          ) : (
            <Button 
              className="bg-white hover:bg-gray-50 text-primary border border-primary font-semibold px-6 py-2 rounded-md transition-colors"
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