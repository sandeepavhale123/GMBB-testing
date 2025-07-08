import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Settings, Palette } from 'lucide-react';

interface SidebarCustomizationSectionProps {
  selectedTheme: string;
  onThemeChange: (themeId: string) => void;
}

const sidebarThemes = [
  {
    id: 'theme_01',
    label: 'Dark Theme',
    bgColor: '#111827',
    labelColor: '#e2e8f0',
    activeMenuBgColor: '#2563eb',
    activeMenuLabelColor: '#fff'
  },
  {
    id: 'theme_02',
    label: 'Teal Theme',
    bgColor: '#14b8a6',
    labelColor: '#1f2937',
    activeMenuBgColor: '#1f2937',
    activeMenuLabelColor: '#fff'
  },
  {
    id: 'theme_03',
    label: 'Purple Theme',
    bgColor: '#7c3aed',
    labelColor: '#1f2937',
    activeMenuBgColor: '#1f2937',
    activeMenuLabelColor: '#fff'
  },
  {
    id: 'theme_04',
    label: 'Orange Theme',
    bgColor: '#fb7185',
    labelColor: '#111827',
    activeMenuBgColor: '#1f2937',
    activeMenuLabelColor: '#fff'
  }
];

const SidebarPreview: React.FC<{ theme: typeof sidebarThemes[0]; isSelected: boolean }> = ({ theme, isSelected }) => {
  const menuItems = ['Overview', 'Posts', 'Media', 'Insights', 'GEO Ranking'];
  
  return (
    <div className="w-full h-32 rounded-lg border overflow-hidden relative" 
         style={{ 
           backgroundColor: theme.bgColor,
           borderColor: '#e5e7eb'
         }}>
      {/* Logo Area */}
      <div className="p-2 border-b border-black/10">
        <div className="text-xs font-semibold truncate" style={{ color: theme.labelColor }}>
          YOUR LOGO
        </div>
      </div>
      
      {/* Menu Items */}
      <div className="p-1 space-y-1">
        {menuItems.slice(0, 4).map((item, index) => (
          <div
            key={item}
            className="px-2 py-1 rounded text-xs truncate"
            style={{
              backgroundColor: index === 1 ? theme.activeMenuBgColor : 'transparent',
              color: index === 1 ? theme.activeMenuLabelColor : theme.labelColor
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomColorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectColor: (colors: any) => void;
}> = ({ isOpen, onClose, onSelectColor }) => {
  const customColorOptions = [
    { bg: '#2563eb', text: '#ffffff', active: '#1d4ed8', label: 'Blue' },
    { bg: '#dc2626', text: '#ffffff', active: '#b91c1c', label: 'Red' },
    { bg: '#059669', text: '#ffffff', active: '#047857', label: 'Green' },
    { bg: '#7c2d12', text: '#ffffff', active: '#92400e', label: 'Brown' },
    { bg: '#1f2937', text: '#d1d5db', active: '#374151', label: 'Gray' },
    { bg: '#581c87', text: '#ffffff', active: '#6b21a8', label: 'Purple' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Choose Custom Colors
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 p-4">
          {customColorOptions.map((color, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border-2 border-transparent hover:border-blue-300 cursor-pointer transition-all"
              onClick={() => {
                onSelectColor({
                  bgColor: color.bg,
                  labelColor: color.text,
                  activeMenuBgColor: color.active,
                  activeMenuLabelColor: '#ffffff'
                });
                onClose();
              }}
            >
              <div 
                className="w-full h-16 rounded mb-2"
                style={{ backgroundColor: color.bg }}
              >
                <div className="p-2">
                  <div className="text-xs font-semibold" style={{ color: color.text }}>
                    Menu
                  </div>
                  <div 
                    className="mt-1 px-2 py-1 rounded text-xs"
                    style={{ backgroundColor: color.active, color: '#ffffff' }}
                  >
                    Active
                  </div>
                </div>
              </div>
              <div className="text-center text-sm font-medium">{color.label}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const SidebarCustomizationSection: React.FC<SidebarCustomizationSectionProps> = ({
  selectedTheme,
  onThemeChange,
}) => {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  
  const handleThemeChange = (themeId: string) => {
    const theme = sidebarThemes.find(t => t.id === themeId);
    if (theme) {
      onThemeChange(themeId);
      
      // Apply to real sidebar immediately
      document.documentElement.style.setProperty('--sidebar-bg', theme.bgColor);
      document.documentElement.style.setProperty('--sidebar-text', theme.labelColor);
      document.documentElement.style.setProperty('--sidebar-active-bg', theme.activeMenuBgColor);
      document.documentElement.style.setProperty('--sidebar-active-text', theme.activeMenuLabelColor);
      document.documentElement.style.setProperty('--sidebar-border', 'rgba(255, 255, 255, 0.1)');
      document.documentElement.style.setProperty('--sidebar-hover-bg', 'rgba(255, 255, 255, 0.1)');
      document.documentElement.style.setProperty('--sidebar-hover-text', '#ffffff');
    }
  };

  const handleCustomColorSelect = (colors: any) => {
    // Apply custom colors immediately
    document.documentElement.style.setProperty('--sidebar-bg', colors.bgColor);
    document.documentElement.style.setProperty('--sidebar-text', colors.labelColor);
    document.documentElement.style.setProperty('--sidebar-active-bg', colors.activeMenuBgColor);
    document.documentElement.style.setProperty('--sidebar-active-text', colors.activeMenuLabelColor);
    document.documentElement.style.setProperty('--sidebar-border', 'rgba(255, 255, 255, 0.1)');
    document.documentElement.style.setProperty('--sidebar-hover-bg', 'rgba(255, 255, 255, 0.1)');
    document.documentElement.style.setProperty('--sidebar-hover-text', '#ffffff');
    
    onThemeChange('custom');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Select Sidebar Background Color
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedTheme} onValueChange={handleThemeChange}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {sidebarThemes.map((theme) => (
              <div 
                key={theme.id} 
                className={`space-y-2 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTheme === theme.id 
                    ? 'border-2 border-blue-400 bg-blue-50' 
                    : 'border-2 border-transparent hover:border-gray-200'
                }`}
                onClick={() => handleThemeChange(theme.id)}
              >
                <div className="relative">
                  <SidebarPreview 
                    theme={theme} 
                    isSelected={selectedTheme === theme.id} 
                  />
                  <RadioGroupItem
                    value={theme.id}
                    id={theme.id}
                    className="absolute top-2 right-2 bg-white pointer-events-none"
                    checked={selectedTheme === theme.id}
                  />
                </div>
                <Label 
                  htmlFor={theme.id} 
                  className="text-sm font-medium text-center cursor-pointer block pointer-events-none"
                >
                  {theme.label}
                </Label>
              </div>
            ))}
            
            {/* Custom Color Card */}
            <div 
              className={`space-y-2 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedTheme === 'custom' 
                  ? 'border-2 border-blue-400 bg-blue-50' 
                  : 'border-2 border-transparent hover:border-gray-200'
              }`}
              onClick={() => setIsCustomModalOpen(true)}
            >
              <div className="relative">
                <div className="w-full h-32 rounded-lg border overflow-hidden relative bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Palette className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm rounded px-2 py-1">
                    <span className="text-xs text-white font-medium">Custom</span>
                  </div>
                </div>
                <RadioGroupItem
                  value="custom"
                  id="custom"
                  className="absolute top-2 right-2 bg-white pointer-events-none"
                  checked={selectedTheme === 'custom'}
                />
              </div>
              <Label 
                htmlFor="custom" 
                className="text-sm font-medium text-center cursor-pointer block pointer-events-none"
              >
                Custom Colors
              </Label>
            </div>
          </div>
        </RadioGroup>
        
        <CustomColorModal
          isOpen={isCustomModalOpen}
          onClose={() => setIsCustomModalOpen(false)}
          onSelectColor={handleCustomColorSelect}
        />
      </CardContent>
    </Card>
  );
};