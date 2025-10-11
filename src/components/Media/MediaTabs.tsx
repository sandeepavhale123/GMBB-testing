import React from "react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface MediaTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MediaTabs: React.FC<MediaTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { t } = useI18nNamespace("Media/mediaLibraryCard");

  const tabs = [
    { value: "all", label: t("mediaLibraryCard.tabs.all") },
    { value: "image", label: t("mediaLibraryCard.tabs.image") },
    { value: "video", label: t("mediaLibraryCard.tabs.video") },
  ];

  return (
    <div className="flex items-center space-x-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-4 py-2 font-medium text-sm rounded-md transition-colors ${
            activeTab === tab.value
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
