import React from "react";

interface ReviewTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{ id: string; label: string }>;
  className?: string;
}

export const ReviewTabs: React.FC<ReviewTabsProps> = ({
  activeTab,
  onTabChange,
  tabs,
  className = "",
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 font-medium text-sm rounded-md transition-colors ${
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
