
import React from 'react';
import { cn } from '../../lib/utils';

interface BusinessTabsProps {
  activeTab: 'business-info' | 'opening-hours' | 'edit-log';
  onTabChange: (tab: 'business-info' | 'opening-hours' | 'edit-log') => void;
}

export const BusinessTabs: React.FC<BusinessTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'business-info' as const, label: 'Business Information' },
    { id: 'opening-hours' as const, label: 'Opening Hours' },
    { id: 'edit-log' as const, label: 'Edit Log' }
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
