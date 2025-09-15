import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Palette } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SettingsNavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}

const settingsNavItems: SettingsNavItem[] = [
  {
    label: 'Theme Customization',
    path: '/module/geo-ranking/settings/theme-customization',
    icon: Palette,
  },
];

export const GeoRankingSettingsLayout: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const getActivePath = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const SettingsNav = () => (
    <nav className="space-y-2">
      {settingsNavItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = getActivePath(item.path);
        
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <IconComponent size={18} />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );

  if (isMobile) {
    return (
      <div className="flex h-[calc(100vh-73px)]">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-lg font-semibold">Settings</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu size={16} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="mt-4">
                  <SettingsNav />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-73px)]">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/10">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <SettingsNav />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};