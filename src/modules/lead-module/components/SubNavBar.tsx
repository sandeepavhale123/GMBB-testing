import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Palette, Mail, Code, Plug, History, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    label: 'Dashboard',
    path: '/module/lead',
    icon: LayoutDashboard
  },
  {
    label: 'Report Branding',
    path: '/module/lead/report-branding',
    icon: Palette
  },
  {
    label: 'Email Template',
    path: '/module/lead/email-template',
    icon: Mail
  },
  {
    label: 'Embedded Iframe',
    path: '/module/lead/embedded-iframe',
    icon: Code
  },
  {
    label: 'Integration',
    path: '/module/lead/integration',
    icon: Plug
  },
  {
    label: 'Credits',
    path: '/module/lead/credits',
    icon: History
  }
];

export const SubNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-end md:justify-end gap-1 md:gap-6 flex-wrap">
          {navItems.map(item => {
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
                <span className="hidden md:block whitespace-nowrap">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};