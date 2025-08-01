import React from 'react';
import { Plus, Grid3X3, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfileDropdown } from '@/components/Header/UserProfileDropdown';
import { useThemeLogo } from '@/hooks/useThemeLogo';
import { useAppSelector } from '@/hooks/useRedux';

export const Header: React.FC = () => {
  const logoData = useThemeLogo();
  const theme = useAppSelector(state => state.theme);

  return (
    <header 
      className="w-full px-4 py-3 border-b border-border"
      style={{ backgroundColor: theme.bg_color || 'hsl(var(--background))' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Section - Logo */}
        <div className="flex items-center gap-3">
          <img 
            src={logoData.darkLogo} 
            alt="Logo" 
            className="h-8 w-auto"
          />
          <span className="text-lg font-semibold text-foreground">
            GMB Briefcase
          </span>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="bg-white text-foreground hover:bg-gray-50">
            <Plus className="w-4 h-4 mr-2" />
            Add Listing
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white hover:text-black">
            <Grid3X3 className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-whitewhite hover:text-black relative">
            <Bell className="w-4 h-4" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></div>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white hover:text-black">
            <Settings className="w-4 h-4" />
          </Button>
          
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};