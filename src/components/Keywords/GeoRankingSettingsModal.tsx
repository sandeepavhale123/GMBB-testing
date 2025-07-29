import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { getDistanceOptions, languageOptions } from '../../utils/geoRankingUtils';

interface GeoRankingSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (settings: GeoRankingSettings) => void;
  keywords: string[];
}

export interface GeoRankingSettings {
  gridSize: string;
  distanceUnit: string;
  distanceValue: string;
  language: string;
}

export const GeoRankingSettingsModal: React.FC<GeoRankingSettingsModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  keywords
}) => {
  const [settings, setSettings] = useState<GeoRankingSettings>({
    gridSize: '5',
    distanceUnit: 'Miles',
    distanceValue: '1',
    language: 'en'
  });

  const handleInputChange = (field: keyof GeoRankingSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSubmit(settings);
    onOpenChange(false);
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
              <SelectTrigger>
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
                onValueChange={(value) => handleInputChange("distanceUnit", value)}
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
            </div>

            {/* Distance Value */}
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Distance</Label>
              <Select
                value={settings.distanceValue}
                onValueChange={(val) => handleInputChange("distanceValue", val)}
              >
                <SelectTrigger>
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
              <SelectTrigger>
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
            disabled={keywords.length === 0}
          >
            Check Rank
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};