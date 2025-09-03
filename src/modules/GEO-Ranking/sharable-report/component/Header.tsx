import React from 'react';
import { useAppSelector } from '@/hooks/useRedux';
import { useThemeLogo } from '@/hooks/useThemeLogo';

export const Header: React.FC = () => {
  const theme = useAppSelector(state => state.theme);
  const logoData = useThemeLogo();

  return ( 
    <header 
      className="fixed top-0 left-0 right-0 z-[405] w-full px-4 py-3 border-b border-border"
      style={{ backgroundColor: theme.bg_color || 'hsl(var(--background))' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left section - Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img 
              src={logoData.darkLogo} 
              alt="Company Logo" 
              className="h-8 w-auto object-contain"
            />
            <div className="border-l border-border/30 pl-3 hidden md:block ">
              <h1 className="text-md font-semibold text-white mb-0 p-0">GEO Ranking Report</h1>
              <p className="text-sm text-white mt-0 p-0">Shared ranking report</p>
            </div>
          </div>
        </div>

        {/* Right section - Minimal for public view */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-white/80">Public Report</span>
        </div>
      </div>
    </header>
  );
};