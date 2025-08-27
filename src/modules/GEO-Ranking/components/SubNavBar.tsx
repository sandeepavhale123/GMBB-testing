import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', path: '/module/geo-ranking' },
  { label: 'Check Rank', path: '/module/geo-ranking/check-rank' },
  { label: 'Google Place API Key', path: '/module/geo-ranking/google-api-key' },
  { label: 'Credits History', path: '/module/geo-ranking/credit-history' },
];

export const SubNavBar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="border-b border-border/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-4 text-sm font-medium transition-colors relative whitespace-nowrap",
                  isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};