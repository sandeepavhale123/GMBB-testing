import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Palette, Mail, Code, Plug, History, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const navItems = [
  {
    label: 'Dashboard',
    path: '/module/lead',
    icon: LayoutDashboard,
    type: 'link'
  },
  {
    label: 'Settings',
    icon: Settings,
    type: 'dropdown',
    submenu: [
      { label: 'Report Branding', path: '/module/lead/report-branding', icon: Palette },
      { label: 'Email Template', path: '/module/lead/email-template', icon: Mail },
      { label: 'Embedded Iframe', path: '/module/lead/embedded-iframe', icon: Code },
      { label: 'Integration', path: '/module/lead/integration', icon: Plug }
    ]
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

  const isSettingsActive = () => {
    const settingsItem = navItems.find(item => item.type === 'dropdown');
    if (!settingsItem?.submenu) return false;
    return settingsItem.submenu.some(subItem => location.pathname === subItem.path);
  };

  return (
    <nav className="fixed top-[65px] left-0 right-0 z-40 w-full px-4 pt-1 pb-0 border-b border-border bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-end md:justify-end gap-1 md:gap-6 flex-wrap">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            
            if (item.type === 'dropdown') {
              const isActive = isSettingsActive();
              return (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-2 px-3 py-4 text-sm font-medium transition-colors relative hover:bg-transparent",
                        isActive
                          ? "text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <IconComponent size={18} />
                      <span className="hidden md:block whitespace-nowrap">{item.label}</span>
                      <ChevronDown size={14} className="hidden md:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[200px]">
                    {item.submenu?.map((subItem) => {
                      const SubIconComponent = subItem.icon;
                      return (
                        <DropdownMenuItem
                          key={subItem.path}
                          className="cursor-pointer"
                          onClick={() => navigate(subItem.path)}
                        >
                          <SubIconComponent size={16} className="mr-2" />
                          {subItem.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            const isActive = location.pathname === item.path;
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