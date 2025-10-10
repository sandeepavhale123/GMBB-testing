import React, { useState, memo, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search } from "lucide-react";
import { Loader } from "../ui/loader";
import { KeywordData, KeywordDetailsResponse } from "../../api/geoRankingApi";
import { AllKeywordsModal } from "./AllKeywordsModal";
import { Button } from "../ui/button";
import { isSingleListingRoute } from "../../utils/routeUtils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface KeywordSelectorProps {
  keywords: KeywordData[];
  selectedKeyword: string;
  selectedDate: string;
  keywordDetails: KeywordDetailsResponse["data"] | null;
  onKeywordChange: (keywordId: string) => void;
  onDateChange: (dateId: string) => void;
  loading: boolean;
  keywordChanging: boolean;
  dateChanging: boolean;
  isRefreshing?: boolean;
  isShareableView?: boolean;
  listingId?: number;
  onDeleteSuccess?: () => void;
}

export const KeywordSelector: React.FC<KeywordSelectorProps> = memo(
  ({
    keywords,
    selectedKeyword,
    selectedDate,
    keywordDetails,
    onKeywordChange,
    onDateChange,
    loading,
    keywordChanging,
    dateChanging,
    isRefreshing = false,
    isShareableView = false,
    listingId,
    onDeleteSuccess,
  }) => {
    const { t } = useI18nNamespace("GeoRanking/keywordSelector");
    const [searchTerm, setSearchTerm] = useState("");
    const [showAllModal, setShowAllModal] = useState(false);

    // Memoize filtered keywords to prevent unnecessary recalculations
    const displayedKeywords = useMemo(() => {
      const filteredKeywords = keywords.filter((keyword) =>
        keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return searchTerm ? filteredKeywords : keywords;
    }, [keywords, searchTerm]);

    // Memoize available dates for the selected keyword
    const availableDates = useMemo(() => {
      return keywordDetails?.dates || [];
    }, [keywordDetails?.dates]);

    // Memoize selected keyword name for display
    const selectedKeywordName = useMemo(() => {
      const selectedKeywordData = keywords.find(
        (k) => k.id === selectedKeyword
      );
      return selectedKeywordData?.keyword || "";
    }, [keywords, selectedKeyword]);

    const handleKeywordSelect = (keywordId: string) => {
      onKeywordChange(keywordId);
      setSearchTerm("");
    };

    const showAllButton =
      !isShareableView && isSingleListingRoute(window.location.pathname);

    return (
      <div
        className={
          isShareableView
            ? "lg:col-span-4 space-y-3"
            : "lg:col-span-3 space-y-3"
        }
      >
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm text-gray-500 font-medium">
            {t("keywordSelector.labels.keyword")}
          </div>
          {showAllButton && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowAllModal(true)}
              className="text-sm text-primary hover:underline font-medium h-auto p-0"
            >
              All
            </Button>
          )}
        </div>
        <Select
          value={selectedKeyword}
          onValueChange={handleKeywordSelect}
          disabled={isRefreshing ? false : loading || keywordChanging}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                loading
                  ? t("keywordSelector.placeholders.keyword.loading")
                  : t("keywordSelector.placeholders.keyword.default")
              }
            >
              {selectedKeywordName}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t("keywordSelector.placeholders.keyword.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            {displayedKeywords.length > 0 ? (
              displayedKeywords.map((keyword) => (
                <SelectItem key={keyword.id} value={keyword.id}>
                  {keyword.keyword}
                </SelectItem>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                {loading
                  ? t("keywordSelector.messages.loading")
                  : t("keywordSelector.messages.noKeywords")}
              </div>
            )}
          </SelectContent>
        </Select>

        <div>
          <Select
            value={selectedDate}
            onValueChange={onDateChange}
            disabled={
              isRefreshing
                ? false
                : loading || availableDates.length === 0 || dateChanging
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  loading
                    ? t("keywordSelector.placeholders.date.loading")
                    : t("keywordSelector.placeholders.date.default")
                }
              />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              {availableDates.map((date) => (
                <SelectItem key={date.id} value={date.id}>
                  {date.date || `Report ${date.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* All Keywords Modal */}
        <AllKeywordsModal
          open={showAllModal}
          onOpenChange={setShowAllModal}
          keywords={keywords}
          listingId={listingId}
          onViewKeyword={onKeywordChange}
          onDeleteSuccess={onDeleteSuccess}
          loading={loading}
        />
      </div>
    );
  }
);
