import React, { useState } from "react";
import { Menu, X, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { useAppSelector } from "../../hooks/useRedux";
import { useListingContext } from "../../context/ListingContext";
import { SingleListingExportReviewsModal } from "./SingleListingExportReviewsModal";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface ReviewsSubHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}
export const ReviewsSubHeader: React.FC<ReviewsSubHeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { t } = useI18nNamespace("Reviews/reviewsSubHeader");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const { selectedListing } = useListingContext();
  const { summaryCards } = useAppSelector((state) => state.reviews);
  const tabs = [
    {
      id: "summary",
      label: t("reviewsSubHeader.tabs.summary"),
    },
    {
      id: "auto-response",
      label: t("reviewsSubHeader.tabs.autoResponse"),
    },
  ];
  const isActiveTab = (tabId: string) => {
    return activeTab === tabId;
  };

  const getReplySettingBadge = () => {
    if (!summaryCards?.reply_setting) return null;

    const badgeConfig = {
      AI: {
        text: t("reviewsSubHeader.replySettingBadge.AI"),
        variant: "default" as const,
      },
      CUSTOM: {
        text: t("reviewsSubHeader.replySettingBadge.CUSTOM"),
        variant: "secondary" as const,
      },
      DNR: {
        text: t("reviewsSubHeader.replySettingBadge.DNR"),
        variant: "destructive" as const,
      },
    };

    const config =
      badgeConfig[summaryCards.reply_setting as keyof typeof badgeConfig];
    if (!config) return null;

    return (
      <Badge
        variant={config.variant}
        className="ml-2"
        style={{ backgroundColor: "#f9a300", color: "white" }}
      >
        {t("reviewsSubHeader.replySettingBadge.prefix")}
        {config.text}
      </Badge>
    );
  };
  return (
    <div className="px-0   py-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Desktop Tabs - Button Style */}
        <div className="hidden sm:flex">
          <Tabs
            value={activeTab}
            onValueChange={(value) => onTabChange(value)}
            className="w-auto"
          >
            <TabsList className={`grid grid-cols-${tabs.length} gap-2`}>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center justify-end sm:justify-end ml-auto gap-2">
          {/* Export Reviews Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportModalOpen(true)}
            className="hidden sm:flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Reviews
          </Button>

          {/* Mobile Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExportModalOpen(true)}
            className="sm:hidden"
          >
            <Download className="h-4 w-4" />
          </Button>

          {/* Reply Setting Badge */}
          {getReplySettingBadge()}

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
            {/* {tabs.map((tab) => (
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
            ))} */}
            <Tabs
              value={activeTab}
              onValueChange={(value) => onTabChange(value)}
              className="w-auto"
            >
              <TabsList className={`grid grid-cols-1 gap-2 h-24`}>
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      )}

      {/* Export Reviews Modal */}
      <SingleListingExportReviewsModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
      />
    </div>
  );
};
