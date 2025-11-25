import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GeoRankingHeader } from "@/components/GeoRanking/GeoRankingHeader";
import { GeoRankingMapSection } from "@/components/GeoRanking/GeoRankingMapSection";
import UnderPerformingTable from "@/components/GeoRanking/UnderPerformingTable";
import GeoPositionModal from "@/components/GeoRanking/GeoPositionModal";
import { Card, CardContent } from "@/components/ui/card";
import { ListingLoader } from "@/components/ui/listing-loader";
import { useShareableGeoKeywords } from "@/hooks/useShareableGeoKeywords";
import { useShareableKeywordDetails } from "@/hooks/useShareableKeywordDetails";
import { useShareableKeywordPositionDetails } from "@/hooks/useShareableKeywordPositionDetails";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ModalData {
  isOpen: boolean;
  gpsCoordinates: string;
  competitors: Array<{
    position: number;
    name: string;
    address: string;
    rating: number;
    reviewCount: number;
    selected?: boolean;
  }>;
  loading: boolean;
}

export const ShareableGeoRankingPage: React.FC = () => {
  const { t } = useI18nNamespace(
    "Geo-Ranking-sharable-report/ShareableGeoRanking"
  );
  const { reportId } = useParams();

  // Fetch shareable keywords data using the encKey as reportId
  const {
    data: shareableData,
    isLoading,
    error,
  } = useShareableGeoKeywords({
    reportId: reportId || "",
  });

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    gpsCoordinates: "",
    competitors: [],
    loading: false,
  });

  const [selectedKeyword, setSelectedKeyword] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Extract data from API response
  const keywords =
    shareableData?.data?.keywords?.map((kw) => ({
      id: kw.id,
      keyword: kw.keyword,
      visibility: 85, // Default visibility since not provided by API
      date: kw.date,
    })) || [];

  const userBusinessName =
    shareableData?.data?.projectName || t("reportNotFound.business");

  // Auto-select first keyword when keywords are loaded
  useEffect(() => {
    if (keywords.length > 0 && !selectedKeyword) {
      setSelectedKeyword(keywords[0].id);
    }
  }, [keywords, selectedKeyword]);

  // Fetch keyword details - use keyword_id for initial load, date_id for date changes
  const {
    data: keywordDetailsData,
    isLoading: keywordDetailsLoading,
    error: keywordDetailsError,
  } = useShareableKeywordDetails({
    reportId: reportId || "",
    keywordId: parseInt(selectedKeyword) || 0,
    dateId: selectedDate,
    isDateBasedCall: false, // This will be handled separately for date changes
    enabled: Boolean(selectedKeyword) && Boolean(reportId),
  });

  // Separate API call for date changes (send date_id as keywordId)
  const { data: dateBasedDetailsData, isLoading: dateDetailsLoading } =
    useShareableKeywordDetails({
      reportId: reportId || "",
      keywordId: parseInt(selectedDate) || 0,
      dateId: selectedDate,
      isDateBasedCall: true,
      enabled:
        Boolean(selectedDate) &&
        Boolean(reportId) &&
        selectedDate !== keywordDetailsData?.data?.dates?.[0]?.id,
    });

  // Auto-select first date when keyword details are loaded
  useEffect(() => {
    if (
      keywordDetailsData?.data?.dates &&
      keywordDetailsData.data.dates.length > 0 &&
      !selectedDate
    ) {
      setSelectedDate(keywordDetailsData.data.dates[0].id);
    }
  }, [keywordDetailsData, selectedDate]);

  // Hook for fetching keyword position details
  const {
    data: positionDetailsData,
    loading: positionDetailsLoading,
    error: positionDetailsError,
    fetchPositionDetails,
  } = useShareableKeywordPositionDetails({
    reportId: reportId || "",
    keywordId: parseInt(selectedKeyword) || 0,
  });

  // Handle keyword selection change
  const handleKeywordChange = (keywordId: string) => {
    setSelectedKeyword(keywordId);
    setSelectedDate(""); // Reset date when keyword changes
  };

  // Handle date selection change - this will trigger the date-based API call
  const handleDateChange = (dateId: string) => {
    setSelectedDate(dateId);
  };

  // Get available dates for the selected keyword
  const availableDates =
    keywordDetailsData?.data?.dates?.map((date) => ({
      id: date.id,
      prev_id: date.prev_id,
      date: date.date,
    })) || [];

  // Get current keyword details - use date-based data if available, otherwise use keyword-based data
  const keywordDetails = dateBasedDetailsData?.data ||
    keywordDetailsData?.data || {
      rankDetails: [],
      dates: [],
      rankStats: {
        atr: "85",
        atrp: "75",
        solvability: "90",
      },
      projectDetails: {
        id: "1",
        sab: "sample",
        keyword: "Sample Keyword",
        mappoint: "40.7128,-74.0060",
        prev_id: "0",
        distance: "10",
        grid: "3x3",
        last_checked: "2024-01-15",
        schedule: "daily",
        date: "2024-01-15",
        coordinate: "40.7128,-74.0060",
      },
      underPerformingArea: [],
    };

  const handleMarkerClick = useCallback(
    async (gpsCoordinates: string, positionId: string) => {
      // Clear previous modal data and show loading
      setModalData({
        isOpen: true,
        gpsCoordinates,
        competitors: [],
        loading: true,
      });

      try {
        await fetchPositionDetails(parseInt(positionId));
      } catch (error) {
        console.error("Error fetching position details:", error);
        setModalData({
          isOpen: true,
          gpsCoordinates,
          competitors: [],
          loading: false,
        });
      }
    },
    [fetchPositionDetails]
  );

  // Update modal data when position details are fetched
  useEffect(() => {
    if (positionDetailsData?.data && modalData.isOpen) {
      const competitors = positionDetailsData.data.keywordDetails.map(
        (detail) => ({
          position: detail.position,
          name: detail.name,
          address: detail.address,
          rating: parseFloat(detail.rating),
          reviewCount: parseInt(detail.review),
          selected: detail.selected,
        })
      );

      setModalData({
        isOpen: true,
        gpsCoordinates: positionDetailsData.data.coordinate,
        competitors,
        loading: false,
      });
    }
  }, [positionDetailsData, modalData.isOpen]);

  const handleCloseModal = useCallback(() => {
    setModalData((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  // Dummy handlers for public view
  const dummyHandler = () => {};

  if (isLoading || (selectedKeyword && keywordDetailsLoading)) {
    return <ListingLoader isLoading={true} children={null} />;
  }

  if (error || keywordDetailsError) {
    return (
      <div className="mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
        <Card className="bg-white shadow-sm max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              {t("reportNotFound.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("reportNotFound.description")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-gray-50 min-h-screen">
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div data-export-target>
            <GeoRankingHeader
              keywords={keywords}
              selectedKeyword={selectedKeyword}
              selectedDate={selectedDate}
              keywordDetails={keywordDetails}
              credits={{ allowedCredit: "0", remainingCredit: 0 }}
              onKeywordChange={handleKeywordChange}
              onDateChange={handleDateChange}
              onClone={dummyHandler}
              onRefresh={dummyHandler}
              onCheckRank={dummyHandler}
              isRefreshing={false}
              refreshProgress={0}
              loading={keywordDetailsLoading}
              keywordChanging={keywordDetailsLoading}
              dateChanging={dateDetailsLoading}
              error={keywordDetailsError?.message || null}
              isShareableView={true}
              projectName={shareableData?.data?.projectName}
            />

            <div className="space-y-4 sm:space-y-6">
              <GeoRankingMapSection
                gridSize={keywordDetails.projectDetails?.grid || "3x3"}
                onMarkerClick={handleMarkerClick}
                rankDetails={keywordDetails.rankDetails}
                rankStats={keywordDetails.rankStats}
                projectDetails={keywordDetails.projectDetails}
                loading={keywordDetailsLoading}
              />

              <UnderPerformingTable
                underPerformingAreas={keywordDetails.underPerformingArea}
                loading={keywordDetailsLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <GeoPositionModal
        isOpen={modalData.isOpen}
        onClose={handleCloseModal}
        gpsCoordinates={modalData.gpsCoordinates}
        competitors={modalData.competitors}
        loading={modalData.loading}
        userBusinessName={userBusinessName}
      />
    </div>
  );
};
