import React from 'react';
import { useAppSelector } from '@/hooks/useRedux';

export const Header: React.FC = () => {
  const theme = useAppSelector(state => state.theme);

  return (
    <header 
      className="h-16 border-b border-border/20 flex items-center px-6"
      style={{ backgroundColor: theme.bg_color || 'hsl(var(--background))' }}
    >
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold text-sm">GR</span>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">GEO Ranking Tool</h1>
          <p className="text-sm text-muted-foreground">Manage your local search rankings</p>
        </div>
      </div>
    </header>
  );
};