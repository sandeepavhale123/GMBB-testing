import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { getDistanceOptions, languageOptions } from '../../utils/geoRankingUtils';
import { useFormValidation } from '../../hooks/useFormValidation';
import { z } from 'zod';

interface GeoRankingSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (settings: GeoRankingSettings) => void;
  keywords: string[];
}

export interface GeoRankingSettings {
  gridSize: string;
  distanceUnit: "Meters" | "Miles";
  distanceValue: string;
  language: string;
}

const geoRankingSchema = z.object({
  gridSize: z.string().min(1, "Grid size is required"),
  distanceUnit: z.enum(["Meters", "Miles"], { required_error: "Distance unit is required" }),
  distanceValue: z.string().min(1, "Distance value is required"),
  language: z.string().min(1, "Language is required")
});

export const GeoRankingSettingsModal: React.FC<GeoRankingSettingsModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  keywords
}) => {
  const [settings, setSettings] = useState<GeoRankingSettings>({
    gridSize: '5',
    distanceUnit: 'Meters',
    distanceValue: '1',
    language: 'en'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { validate, getFieldError, hasFieldError } = useFormValidation(geoRankingSchema);

  const handleInputChange = (field: keyof GeoRankingSettings, value: string) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [field]: value
      };
      
      // Auto-set distance value when unit changes to Miles
      if (field === 'distanceUnit' && value === 'Miles') {
        newSettings.distanceValue = '1';
      }
      
      return newSettings;
    });
  };

  const handleSubmit = async () => {
    const validation = validate(settings);
    
    if (!validation.isValid || keywords.length === 0) {
      return;
    }

    setIsSubmitting(true);
    
    // 3-second delay before redirect
    setTimeout(() => {
      onSubmit(settings);
      onOpenChange(false);
      setIsSubmitting(false);
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>GEO Ranking Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Keywords Preview */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Keywords ({keywords.length})
            </Label>
            <div className="text-sm text-muted-foreground">
              {keywords.join(', ')}
            </div>
          </div>

          {/* Grid Size */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Grid Size
            </Label>
            <Select
              value={settings.gridSize}
              onValueChange={(value) => handleInputChange("gridSize", value)}
            >
              <SelectTrigger className={hasFieldError("gridSize") ? "border-destructive" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3x3</SelectItem>
                <SelectItem value="5">5x5</SelectItem>
                <SelectItem value="7">7x7</SelectItem>
                <SelectItem value="9">9x9</SelectItem>
                <SelectItem value="11">11x11</SelectItem>
                <SelectItem value="13">13x13</SelectItem>
              </SelectContent>
            </Select>
            {hasFieldError("gridSize") && (
              <p className="text-sm text-destructive">{getFieldError("gridSize")}</p>
            )}
          </div>

          {/* Distance Settings */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Distance Settings
            </Label>
            
            {/* Distance Unit */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Unit</Label>
               <RadioGroup
                value={settings.distanceUnit}
                onValueChange={(value) => handleInputChange("distanceUnit", value as "Meters" | "Miles")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Meters" id="meters" />
                  <Label htmlFor="meters" className="text-sm cursor-pointer">
                    Meters
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Miles" id="miles" />
                  <Label htmlFor="miles" className="text-sm cursor-pointer">
                    Miles
                  </Label>
                </div>
              </RadioGroup>
              {hasFieldError("distanceUnit") && (
                <p className="text-sm text-destructive">{getFieldError("distanceUnit")}</p>
              )}
            </div>

            {/* Distance Value */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Distance</Label>
              <Select
                value={settings.distanceValue}
                onValueChange={(val) => handleInputChange("distanceValue", val)}
              >
                <SelectTrigger className={hasFieldError("distanceValue") ? "border-destructive" : ""}>
                  <SelectValue placeholder="Choose…" />
                </SelectTrigger>
                <SelectContent>
                  {getDistanceOptions(settings.distanceUnit)?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasFieldError("distanceValue") && (
                <p className="text-sm text-destructive">{getFieldError("distanceValue")}</p>
              )}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Language
            </Label>
            <Select
              value={settings.language}
              onValueChange={(value) => handleInputChange("language", value)}
            >
              <SelectTrigger className={hasFieldError("language") ? "border-destructive" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasFieldError("language") && (
              <p className="text-sm text-destructive">{getFieldError("language")}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={keywords.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Check Rank"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};