
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, CreditCard, Palette, Settings as SettingsIcon } from 'lucide-react';

interface SettingsSubHeaderProps {
  activeTab: string;
}

export const SettingsSubHeader: React.FC<SettingsSubHeaderProps> = ({
  activeTab
}) => {
  const location = useLocation();
  
  const tabs = [
    { 
      id: 'google-account', 
      label: 'Google Account', 
      path: '/settings/google-account',
      icon: User
    },
    { 
      id: 'subscription', 
      label: 'Subscription', 
      path: '/settings/subscription',
      icon: CreditCard
    },
    { 
      id: 'branding', 
      label: 'Branding', 
      path: '/settings/branding',
      icon: Palette
    },
    { 
      id: 'integrations', 
      label: 'Integrations', 
      path: '/settings/integrations',
      icon: SettingsIcon
    }
  ];

  const isActiveTab = (tabId: string) => {
    return location.pathname.includes(tabId);
  };

  return (
    <div className="flex h-full">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActiveTab(tab.id)
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
