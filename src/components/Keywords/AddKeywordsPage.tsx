import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, X, Search, ArrowLeft, Filter, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useNavigate } from "react-router-dom";
import {
  getKeywordSearchVolume,
  KeywordSearchData,
  getSearchCredits,
} from "../../api/geoRankingApi";
import { useToast } from "../../hooks/use-toast";
import { KeywordFilterModal } from "./KeywordFilterModal";
import {
  GeoRankingSettingsModal,
  GeoRankingSettings,
} from "./GeoRankingSettingsModal";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { BuyCreditsModal } from "../credits_modal/BuyCreditsModal";

interface AddKeywordsPageProps {
  onAddKeywords: (keywords: string[], settings: GeoRankingSettings) => void;
  isLoading?: boolean;
}
interface RecommendedKeyword {
  keyword: string;
  searches: number;
  localPack?: boolean;
  competition?: string;
}
const recommendedKeywords: RecommendedKeyword[] = [];
export const AddKeywordsPage: React.FC<AddKeywordsPageProps> = ({
  onAddKeywords,
  isLoading = false,
}) => {
  const { t } = useI18nNamespace("Keywords/AddKeywordsPage");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<RecommendedKeyword[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isGeoSettingsModalOpen, setIsGeoSettingsModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("2840");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [displayedKeywordsCount, setDisplayedKeywordsCount] = useState(5);
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch search credits on mount
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        setIsLoadingCredits(true);
        const response = await getSearchCredits();
        if (response.code === 200) {
          setRemainingCredits(response.data.credits.remainingCredit);
        }
      } catch (error) {
        console.error("Failed to fetch search credits:", error);
        setRemainingCredits(0);
      } finally {
        setIsLoadingCredits(false);
      }
    };
    fetchCredits();
  }, []);
  const handleAddKeyword = () => {
    const trimmedKeyword = keywordInput.trim();
    if (
      trimmedKeyword &&
      !keywords.includes(trimmedKeyword) &&
      keywords.length < 5
    ) {
      setKeywords((prev) => [...prev, trimmedKeyword]);
      setKeywordInput("");
    }
  };
  const handleSearchKeyword = async () => {
    const trimmedKeyword = keywordInput.trim();
    if (!trimmedKeyword) return;
    setIsSearching(true);
    try {
      const response = await getKeywordSearchVolume({
        keywords: [trimmedKeyword],
        country: selectedCountry,
        language: selectedLanguage,
      });
      if (response.code === 200) {
        const newResults: RecommendedKeyword[] = response.data.map(
          (item: KeywordSearchData) => ({
            keyword: item.keyword,
            searches: item.search_volume,
            competition: item.competition,
            localPack: false,
          })
        );
        setSearchResults(newResults);
        setKeywordInput("");
        toast({
          title: t("AddKeywordsPage.toast.keywordsFoundTitle"),
          description: t("AddKeywordsPage.toast.keywordsFoundDescription", {
            count: newResults.length,
          }),
          // `Found ${newResults.length} keyword(s) with search data.`,
        });
      }
    } catch (error: any) {
      // console.error("Keyword search error:", error);
      if (error.response?.status === 401) {
        toast({
          title: t("AddKeywordsPage.toast.authErrorTitle"),
          description: t("AddKeywordsPage.toast.authErrorDescription"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("AddKeywordsPage.toast.searchFailedTitle"),
          description: t("AddKeywordsPage.toast.searchFailedDescription"),
          variant: "destructive",
        });
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterApply = (country: string, language: string) => {
    setSelectedCountry(country);
    setSelectedLanguage(language);
  };

  const getCountryLabel = (code: string) => {
    const countryOptions = [
      { value: "2840", label: "United States" },
      { value: "2826", label: "United Kingdom" },
      { value: "2124", label: "Canada" },
      { value: "2036", label: "Australia" },
      { value: "2276", label: "Germany" },
      { value: "2250", label: "France" },
      { value: "2724", label: "Spain" },
      { value: "2380", label: "Italy" },
      { value: "2528", label: "Netherlands" },
      { value: "2056", label: "Belgium" },
      { value: "2752", label: "Sweden" },
      { value: "2578", label: "Norway" },
      { value: "2208", label: "Denmark" },
      { value: "2246", label: "Finland" },
      { value: "2616", label: "Poland" },
      { value: "2203", label: "Czech Republic" },
      { value: "2040", label: "Austria" },
      { value: "2756", label: "Switzerland" },
      { value: "2392", label: "Japan" },
      { value: "2410", label: "South Korea" },
      { value: "2156", label: "China" },
      { value: "2356", label: "India" },
      { value: "2076", label: "Brazil" },
      { value: "2484", label: "Mexico" },
      { value: "2032", label: "Argentina" },
    ];
    return countryOptions.find((c) => c.value === code)?.label || code;
  };

  const getLanguageLabel = (code: string) => {
    const languageOptions = [
      { value: "en", label: "English" },
      { value: "es", label: "Spanish" },
      { value: "fr", label: "French" },
      { value: "de", label: "German" },
      { value: "it", label: "Italian" },
      { value: "pt", label: "Portuguese" },
      { value: "nl", label: "Dutch" },
      { value: "sv", label: "Swedish" },
      { value: "no", label: "Norwegian" },
      { value: "da", label: "Danish" },
      { value: "fi", label: "Finnish" },
      { value: "pl", label: "Polish" },
      { value: "cs", label: "Czech" },
      { value: "ja", label: "Japanese" },
      { value: "ko", label: "Korean" },
      { value: "zh", label: "Chinese" },
      { value: "hi", label: "Hindi" },
      { value: "ar", label: "Arabic" },
      { value: "ru", label: "Russian" },
    ];
    return languageOptions.find((l) => l.value === code)?.label || code;
  };
  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords((prev) =>
      prev.filter((keyword) => keyword !== keywordToRemove)
    );
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };
  const handleAddRecommended = (keyword: string) => {
    if (!keywords.includes(keyword) && keywords.length < 5) {
      setKeywords((prev) => [...prev, keyword]);
    }
  };
  const handleCheckPosition = () => {
    if (keywords.length > 0) {
      setIsGeoSettingsModalOpen(true);
    }
  };

  const handleGeoSettingsSubmit = (settings: GeoRankingSettings) => {
    // Pass keywords and settings to parent
    onAddKeywords(keywords, settings);
    navigate(-1);
  };
  return (
    <TooltipProvider>
      <div className="bg-background p-4 sm:p-6 min-h-[90vh]">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("AddKeywordsPage.back")}
          </Button>

          <div className="py-[20px] px-[30px] border border-border rounded-lg bg-white  mb-4">
            {/* Header */}
            <div className="flex items-center justify-between text-base sm:text-lg font-medium text-foreground mb-6 sm:mb-8">
              <div className="flex items-center mb-0">
                <Search className="h-5 w-5 text-primary mr-2" />
                {t("AddKeywordsPage.header")}
              </div>
              {/* Show remaining credits */}
              <div className="flex items-center">
                {!isLoadingCredits && remainingCredits !== null && (
                  <Badge 
                    variant={remainingCredits === 0 ? "destructive" : "secondary"} 
                  >
                    {remainingCredits} {t("AddKeywordsPage.creditsRemaining")}
                  </Badge>
                )}
                {isLoadingCredits && (
                  <Skeleton className="h-5 w-24" />
                )}
              </div>
            </div>

            {/* No Credits Warning */}
            {remainingCredits === 0 && !isLoadingCredits && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <p className="text-destructive text-sm">
                    {t("AddKeywordsPage.noCreditsWarning")}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsBuyCreditsModalOpen(true)}
                >
                  {t("AddKeywordsPage.buyCredits")}
                </Button>
              </div>
            )}

            {/* Search Input */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("AddKeywordsPage.inputPlaceholder")}
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12"
                  disabled={keywords.length >= 5}
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setIsFilterModalOpen(true)}
                className="h-12 px-4 w-full sm:w-auto"
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSearchKeyword}
                disabled={
                  !keywordInput.trim() || keywords.length >= 5 || isSearching || remainingCredits === 0
                }
                className="h-12 px-6 w-full sm:w-auto"
              >
                {isSearching
                  ? t("AddKeywordsPage.searching")
                  : t("AddKeywordsPage.searchButton")}
              </Button>
            </div>

            {/* Selected Filters */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  {t("AddKeywordsPage.country")}:{" "}
                  {getCountryLabel(selectedCountry)}
                </span>
                <span>|</span>
                <span>
                  {t("AddKeywordsPage.language")}:{" "}
                  {getLanguageLabel(selectedLanguage)}
                </span>
              </div>
            </div>
          </div>

          {/* Added Keywords */}
          <div className="sticky top-0 bg-background z-10 flex flex-col sm:flex-row sm:items-center gap-3 mb-6 sm:justify-between py-4">
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm"
                >
                  {keyword}
                  <button
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="hover:bg-muted rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${keyword}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {keywords.length > 0 && (
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <span className="text-sm text-muted-foreground">
                  {t("AddKeywordsPage.addedCount", { count: keywords.length })}
                  {/* {keywords.length}/5 */}
                </span>
                <Button
                  onClick={handleCheckPosition}
                  size="sm"
                  className="h-8 px-4 whitespace-nowrap"
                  disabled={isLoading}
                >
                  {isLoading
                    ? t("AddKeywordsPage.addingKeywords")
                    : t("AddKeywordsPage.checkRank")}
                </Button>
              </div>
            )}
          </div>

          {/* Recommended Keywords */}
          {isSearching ? (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {t("AddKeywordsPage.recommendedKeywords")}
              </h3>
              <div className="space-y-3">
                {/* Skeleton loaders during API call */}
                {Array.from({
                  length: 3,
                }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="w-8 h-8 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {isSearching ? t("AddKeywordsPage.recommendedKeywords") : ""}
              </h3>
              <div className="space-y-3">
                {/* Display combined results: search results first, then recommended */}
                {[...searchResults, ...recommendedKeywords]
                  .slice(0, displayedKeywordsCount)
                  .map((item, index) => (
                    <div
                      key={`keyword-${index}`}
                      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg transition-colors gap-3 ${
                        keywords.includes(item.keyword)
                          ? "bg-primary/10 border-primary/30"
                          : "hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex-1">
                        <span className="font-medium text-foreground">
                          {item.keyword}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex flex-col sm:text-right gap-2">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
                            <span className="whitespace-nowrap">
                              ~ {item.searches.toLocaleString()} searches
                            </span>
                            {item.competition && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground">
                                  {t("AddKeywordsPage.competition")}
                                </span>
                                <span
                                  className={`text-xs px-2 py-1 rounded font-medium ${
                                    item.competition === "LOW"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      : item.competition === "MEDIUM"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                      : item.competition === "HIGH"
                                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {item.competition}
                                </span>
                              </div>
                            )}
                            {item.localPack && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <span className="text-primary">
                                  {" "}
                                  {t("AddKeywordsPage.localPack")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleAddRecommended(item.keyword)}
                              size="sm"
                              variant="outline"
                              disabled={
                                keywords.includes(item.keyword) ||
                                keywords.length >= 5
                              }
                              className="w-8 h-8 p-0 self-end sm:self-center"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("AddKeywordsPage.addKeyword")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  ))}

                {/* Load More Button */}
                {[...searchResults, ...recommendedKeywords].length >
                  displayedKeywordsCount && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setDisplayedKeywordsCount((prev) => prev + 100)
                      }
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 mb-10"
                    >
                      {t("AddKeywordsPage.loadMore")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Filter Modal */}
          <KeywordFilterModal
            open={isFilterModalOpen}
            onOpenChange={setIsFilterModalOpen}
            onApply={handleFilterApply}
            currentCountry={selectedCountry}
            currentLanguage={selectedLanguage}
          />

          {/* GEO Ranking Settings Modal */}
          <GeoRankingSettingsModal
            open={isGeoSettingsModalOpen}
            onOpenChange={setIsGeoSettingsModalOpen}
            onSubmit={handleGeoSettingsSubmit}
            keywords={keywords}
          />

          {/* Buy Credits Modal */}
          <BuyCreditsModal
            open={isBuyCreditsModalOpen}
            onOpenChange={setIsBuyCreditsModalOpen}
          />

          {/* Bottom Note */}
        </div>
      </div>
    </TooltipProvider>
  );
};
