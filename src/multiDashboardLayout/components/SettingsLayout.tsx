import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  User, 
  Users, 
  CreditCard, 
  Palette, 
  FileText, 
  Settings 
} from 'lucide-react';

interface SettingsNavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const settingsNavItems: SettingsNavItem[] = [
  {
    label: 'Google Account',
    path: '/main-dashboard/settings/google-account',
    icon: User
  },
  {
    label: 'Team Members',
    path: '/main-dashboard/settings/team-members',
    icon: Users
  },
  {
    label: 'Subscription',
    path: '/main-dashboard/settings/subscription',
    icon: CreditCard
  },
  {
    label: 'Theme Customization',
    path: '/main-dashboard/settings/theme-customization',
    icon: Palette
  },
  {
    label: 'Report Branding',
    path: '/main-dashboard/settings/report-branding',
    icon: FileText
  },
  {
    label: 'Integrations',
    path: '/main-dashboard/settings/integrations',
    icon: Settings
  }
];

export const SettingsLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex gap-6 min-h-[600px]">
      {/* Left Sidebar - Settings Navigation */}
      <div className="w-64 bg-white border border-border rounded-lg p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Settings</h3>
          <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>
        
        <nav className="space-y-1">
          {settingsNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 bg-white border border-border rounded-lg">
        <Outlet />
      </div>
    </div>
  );
};