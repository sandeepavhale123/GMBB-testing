import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Settings } from 'lucide-react';

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

export const SidebarCustomizationSection: React.FC<SidebarCustomizationSectionProps> = ({
  selectedTheme,
  onThemeChange,
}) => {
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
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};