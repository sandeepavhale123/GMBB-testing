
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";

interface ReviewsSubHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ReviewsSubHeader: React.FC<ReviewsSubHeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const tabs = [
    {
      id: "summary",
      label: "Review Summary",
    },
    {
      id: "auto-response",
      label: "Auto Response",
    },
  ];

  const isActiveTab = (tabId: string) => {
    return activeTab === tabId;
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Desktop Tabs - Left Aligned */}
          <div className="hidden sm:flex">
            <div className="flex space-x-8 flex-wrap -mb-[1px]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActiveTab(tab.id)
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end sm:justify-end ml-auto">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="sm:hidden mt-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setShowMobileMenu(false);
                  }}
                  className={`text-left py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                    isActiveTab(tab.id)
                      ? "bg-primary text-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
