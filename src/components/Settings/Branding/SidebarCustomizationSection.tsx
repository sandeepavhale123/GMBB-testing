import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Settings, Check, Palette } from 'lucide-react';

interface SidebarCustomizationSectionProps {
  customSidebarColor: string;
  customLabelColor: string;
  onSidebarColorChange: (color: string) => void;
  onLabelColorChange: (color: string) => void;
}

const sidebarThemes = [
  { id: 'dark', label: 'Dark', color: '#1f2937' },
  { id: 'light', label: 'Light', color: '#ffffff' },
  { id: 'blue', label: 'Blue', color: '#3b82f6' },
  { id: 'green', label: 'Green', color: '#10b981' },
  { id: 'purple', label: 'Purple', color: '#8b5cf6' },
];

export const SidebarCustomizationSection: React.FC<SidebarCustomizationSectionProps> = ({
  customSidebarColor,
  customLabelColor,
  onSidebarColorChange,
  onLabelColorChange,
}) => {
  const handleSidebarColorChange = (color: string) => {
    onSidebarColorChange(color);
    // Apply to real sidebar immediately
    document.documentElement.style.setProperty('--sidebar-bg', color);
    document.documentElement.style.setProperty('--sidebar-text', color === '#ffffff' ? '#374151' : '#ffffff');
  };

  const handleLabelColorChange = (color: string) => {
    onLabelColorChange(color);
    // Apply to real sidebar immediately
    document.documentElement.style.setProperty('--sidebar-text', color);
  };

  const handleCustomColorChange = (color: string) => {
    handleSidebarColorChange(color);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Sidebar Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sidebar Background Color Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Select Sidebar Background Color</Label>
          <div className="flex flex-wrap gap-3">
            {sidebarThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleSidebarColorChange(theme.color)}
                className={`relative w-16 h-16 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  customSidebarColor === theme.color
                    ? 'border-primary ring-2 ring-offset-2 ring-primary/20' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ 
                  backgroundColor: theme.color,
                  border: theme.id === 'light' ? '2px solid #e5e7eb' : undefined
                }}
              >
                {customSidebarColor === theme.color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white drop-shadow-lg" />
                  </div>
                )}
              </button>
            ))}
            
            {/* Custom Color Picker */}
            <div className="relative">
              <input
                type="color"
                value={customSidebarColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                className="w-16 h-16 rounded-lg border-2 border-gray-200 cursor-pointer"
                title="Select custom color"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border border-gray-300 flex items-center justify-center">
                <Palette className="w-3 h-3 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Custom Label Color */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Label Color</Label>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded border-2 border-gray-200"
              style={{ backgroundColor: customLabelColor }}
            />
            <Input
              type="color"
              value={customLabelColor}
              onChange={(e) => handleLabelColorChange(e.target.value)}
              className="w-20 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={customLabelColor}
              onChange={(e) => handleLabelColorChange(e.target.value)}
              className="flex-1 font-mono text-sm"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};