import React from 'react';
import { useAppSelector } from '@/hooks/useRedux';
import { useThemeLogo } from '@/hooks/useThemeLogo';

interface PublicMultiDashboardLayoutProps {
  children: React.ReactNode;
}

export const PublicMultiDashboardLayout: React.FC<PublicMultiDashboardLayoutProps> = ({ 
  children 
}) => {
  const theme = useAppSelector(state => state.theme);
  const logoData = useThemeLogo();

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.bg_color || 'hsl(var(--background))' }}
    >
      {/* Simplified Header - Only Logo */}
      <header
        className="w-full px-4 py-3 border-b border-border"
        style={{
          backgroundColor: theme.bg_color || "hsl(var(--background))",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center">
          <img src={logoData.darkLogo} alt="Logo" className="h-10 w-auto" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Optional Footer */}
      <footer className="py-4 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          Public Multi-Dashboard Report
        </div>
      </footer>
    </div>
  );
};