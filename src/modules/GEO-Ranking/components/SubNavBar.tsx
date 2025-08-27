import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Search, Key, History } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/module/geo-ranking', icon: LayoutDashboard },
  { label: 'Check Rank', path: '/module/geo-ranking/check-rank', icon: Search },
  { label: 'Google Place API Key', path: '/module/geo-ranking/google-api-key', icon: Key },
  { label: 'Credits History', path: '/module/geo-ranking/credit-history', icon: History },
];

export const SubNavBar: React.FC = () => {
  const location = useLocation();
 
  return (
    <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center md:justify-end gap-1 md:gap-6 flex-wrap">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-4 text-sm font-medium transition-colors relative",
                  isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <IconComponent size={18} />
                <span className="hidden md:inline whitespace-nowrap">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};