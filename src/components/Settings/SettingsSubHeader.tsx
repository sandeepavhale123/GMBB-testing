
import React from 'react';

interface SettingsSubHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const SettingsSubHeader: React.FC<SettingsSubHeaderProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'google-account', label: 'Manage Google Account' },
    { id: 'genie-subscription', label: 'Genie Subscription' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          
          <div className="flex space-x-8 border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
