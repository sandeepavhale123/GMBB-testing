import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useToast } from "./use-toast";
import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  fetchInsightsSummary,
  fetchVisibilityTrends,
  fetchCustomerActions,
  refreshInsights,
} from "../store/slices/insightsSlice";
import { useListingContext } from "../context/ListingContext";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const useInsightsData = () => {
  const { t } = useI18nNamespace("hooks/useInsightsData");
  const [dateRange, setDateRange] = useState("30");
  const [customDateRange, setCustomDateRange] = useState<
    DateRange | undefined
  >();

  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { selectedListing } = useListingContext();

  const {
    summary,
    visibilityTrends,
    customerActions,
    isLoadingSummary,
    isLoadingVisibility,
    isLoadingCustomerActions,
    isRefreshing,
    summaryError,
    visibilityError,
    customerActionsError,
    refreshError,
    lastUpdated,
  } = useAppSelector((state) => state.insights);

  // Fetch data when component mounts or parameters change
  useEffect(() => {
    if (selectedListing?.id && dateRange !== "custom") {
      fetchData();
    } else if (
      selectedListing?.id &&
      dateRange === "custom" &&
      customDateRange?.from &&
      customDateRange?.to
    ) {
      fetchData();
    }
  }, [selectedListing?.id, dateRange, customDateRange]);

  const fetchData = async () => {
    if (!selectedListing?.id) return;

    const params = {
      listingId: parseInt(selectedListing.id, 10),
      dateRange,
      startDate: customDateRange?.from
        ? format(customDateRange.from, "yyyy-MM-dd")
        : "",
      endDate: customDateRange?.to
        ? format(customDateRange.to, "yyyy-MM-dd")
        : "",
    };

    try {
      await Promise.all([
        dispatch(fetchInsightsSummary(params)),
        dispatch(fetchVisibilityTrends(params)),
        dispatch(fetchCustomerActions(params)),
      ]);
    } catch (error) {
      // console.error("Error fetching insights data:", error);
    }
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    if (value !== "custom") {
      setCustomDateRange(undefined);
    }
  };

  const handleCustomDateRangeChange = (dateRange: DateRange | undefined) => {
    setCustomDateRange(dateRange);
  };

  const handleRefresh = async () => {
    if (!selectedListing?.id) return;

    try {
      // First call the refresh insights API
      await dispatch(
        refreshInsights({
          listingId: parseInt(selectedListing.id, 10),
        })
      ).unwrap();

      // Then fetch the updated data
      await fetchData();

      toast({
        title: t("insights.toast.dataRefreshedTitle"),
        description: t("insights.toast.dataRefreshedDescription"),
      });
    } catch (error) {
      // console.error("Error refreshing insights:", error);
      toast({
        title: t("insights.toast.refreshFailedTitle"),
        description:
          refreshError ||
          error.message ||
          error?.response?.data?.message ||
          t("insights.toast.refreshFailedDescription"),
        variant: "destructive",
      });
    }
  };

  return {
    dateRange,
    customDateRange,
    summary,
    visibilityTrends,
    customerActions,
    isLoadingSummary,
    isLoadingVisibility,
    isLoadingCustomerActions,
    isRefreshing,
    summaryError,
    visibilityError,
    customerActionsError,
    refreshError,
    lastUpdated,
    selectedListing,
    handleDateRangeChange,
    handleCustomDateRangeChange,
    handleRefresh,
  };
};
