import { useState } from "react";
import { getKeywordDetails, refreshKeyword } from "../api/geoRankingApi";
import { useToast } from "./use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface UseKeywordRefreshProps {
  listingId: number;
  selectedKeyword: string;
  onKeywordsUpdate: (selectKeywordId?: string) => Promise<void>;
  fetchKeywordDetailsManually?: (keywordId: string) => Promise<void>;
  onDateSelect?: (dateId: string) => void;
}

export const useKeywordRefresh = ({
  listingId,
  selectedKeyword,
  onKeywordsUpdate,
  fetchKeywordDetailsManually,
  onDateSelect,
}: UseKeywordRefreshProps) => {
  const { t } = useI18nNamespace("hooks/useKeywordRefresh");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [isPollingActive, setIsPollingActive] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(0);
  const { toast } = useToast();

  const handleRefreshKeyword = async () => {
    if (!listingId || !selectedKeyword) return;

    setRefreshing(true);
    setRefreshError(null);
    setRefreshProgress(0);
    setIsPollingActive(true);

    try {
      // Call refresh keyword API
      const refreshResponse = await refreshKeyword({
        listingId,
        keywordId: selectedKeyword,
      });

      if (refreshResponse.code === 200) {
        const newKeywordId = refreshResponse.data.keywordId.toString();

        toast({
          title: t("keywordRefresh.toast.refreshStarted.title"),
          description: refreshResponse.message,
        });

        // Poll for new keyword details with timeout
        let pollAttempts = 0;
        const maxAttempts = 60;

        const pollForNewData = async () => {
          try {
            const currentProgress = Math.min(
              Math.floor((pollAttempts / maxAttempts) * 95),
              95
            );
            setRefreshProgress(currentProgress);

            const detailsResponse = await getKeywordDetails(
              listingId,
              newKeywordId
            );
            if (detailsResponse.code === 200) {
              setIsPollingActive(false);
              setRefreshProgress(100);

              // First, update keywords list to include new keyword
              await onKeywordsUpdate(newKeywordId);

              // Then manually fetch and set keyword details
              if (fetchKeywordDetailsManually) {
                await fetchKeywordDetailsManually(newKeywordId);
              }

              // Auto-select the latest date after refresh
              if (
                onDateSelect &&
                detailsResponse.data.dates &&
                detailsResponse.data.dates.length > 0
              ) {
                const sortedDates = detailsResponse.data.dates
                  .filter((d) => d.date)
                  .sort(
                    (a, b) =>
                      new Date(b.date!).getTime() - new Date(a.date!).getTime()
                  );

                if (sortedDates.length > 0) {
                  onDateSelect(sortedDates[0].id);
                }
              }

              toast({
                title: t("keywordRefresh.toast.refreshComplete.title"),
                description: t(
                  "keywordRefresh.toast.refreshComplete.description"
                ),
              });

              setTimeout(() => {
                setRefreshProgress(0);
                setRefreshing(false);
              }, 1000);
              return;
            }
          } catch (error) {
            console.error("Error polling for new keyword data:", error);
          }

          pollAttempts++;
          if (pollAttempts < maxAttempts) {
            setTimeout(pollForNewData, 5000);
          } else {
            setIsPollingActive(false);
            setRefreshProgress(0);
            setRefreshError("Refresh timeout - please try again");
            setRefreshing(false);
            toast({
              title: t("keywordRefresh.toast.refreshTimeout.title"),
              description: t("keywordRefresh.toast.refreshTimeout.description"),
              variant: "destructive",
            });
          }
        };

        setTimeout(pollForNewData, 2000);
      } else {
        throw new Error(refreshResponse.message || "Failed to refresh keyword");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : t("keywordRefresh.toast.refreshFailed.description");
      setRefreshError(errorMessage);
      setRefreshing(false);
      setIsPollingActive(false);
      toast({
        title: t("keywordRefresh.toast.refreshFailed.title"),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return {
    refreshing,
    refreshError,
    refreshProgress,
    isPollingActive,
    handleRefreshKeyword,
  };
};
