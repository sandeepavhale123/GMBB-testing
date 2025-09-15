import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, History, Settings } from 'lucide-react';

const navItems = [
  {
    label: 'Dashboard',
    path: '/module/lead',
    icon: LayoutDashboard,
    type: 'link'
  },
  {
    label: 'Settings',
    path: '/module/lead/settings',
    icon: Settings,
    type: 'link'
  },
  {
    label: 'Credits',
    path: '/module/lead/credits',
    icon: History,
    type: 'link'
  }
];

export const SubNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();


  return (
    <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-end md:justify-end gap-1 md:gap-6 flex-wrap">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            
            return (
              <NavLink
                key={item.path}
                to={item.path!}
                className={cn(
                  "flex items-center gap-2 px-3 py-4 text-sm font-medium transition-colors relative",
                  isActive
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <IconComponent size={18} />
                <span className="hidden md:block whitespace-nowrap">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};