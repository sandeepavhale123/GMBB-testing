import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PublicReportLayout } from "../components/PublicReportLayout";
import { GeoRankingHeader } from "@/components/GeoRanking/GeoRankingHeader";
import { GeoRankingMapSection } from "@/components/GeoRanking/GeoRankingMapSection";
import GeoPositionModal from "@/components/GeoRanking/GeoPositionModal";
import { Card, CardContent } from "@/components/ui/card";
import { useLeadGeoRanking } from "@/hooks/useLeadGeoRanking";
import { useLeadKeywordPositionDetails } from "@/hooks/useLeadKeywordPositionDetails";
import { useGetLeadReportBrandingPublic } from "@/api/leadPublicApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import i18n from "@/i18n";

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "fr", name: "French" },
];
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

export const LeadGeoRankingReport: React.FC = () => {
  const { t, loaded } = useI18nNamespace(
    "Lead-module-public-report/leadGeoRankingReport"
  );
  const { reportId } = useParams<{ reportId: string }>();

  const currentLang = i18n.language || "en";

  // Find the full name
  const currentLangName = languages.find(
    (lang) => lang.code === currentLang
  )?.name;

  // Use the lead geo ranking hook for real data
  const {
    keywords,
    businessInfo,
    rankingData,
    projectDetails: apiProjectDetails,
    availableDates,
    selectedKeyword,
    isLoading,
    error,
    handleKeywordChange,
    handleDateChange,
    setSelectedKeyword,
  } = useLeadGeoRanking(reportId || "", currentLangName);

  // Get branding data
  const { data: brandingData } = useGetLeadReportBrandingPublic(
    reportId || "",
    currentLangName
  );

  // Position details hook for modal
  const {
    data: positionDetailsData,
    loading: positionDetailsLoading,
    error: positionDetailsError,
    fetchPositionDetails,
  } = useLeadKeywordPositionDetails();

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    gpsCoordinates: "",
    competitors: [],
    loading: false,
  });

  // Set first keyword as default when data loads
  useEffect(() => {
    if (keywords.length > 0 && !selectedKeyword) {
      setSelectedKeyword(keywords[0].id);
    }
  }, [keywords, selectedKeyword, setSelectedKeyword]);

  // Update modal data when position details are fetched
  useEffect(() => {
    if (positionDetailsData && modalData.isOpen) {
      setModalData((prev) => ({
        ...prev,
        competitors: positionDetailsData.competitors,
        gpsCoordinates: positionDetailsData.coordinates,
        loading: false,
      }));
    }
  }, [positionDetailsData, modalData.isOpen]);

  // Handle marker click with real API call
  const handleMarkerClick = useCallback(
    async (gpsCoordinates: string, positionId: string) => {
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
        setModalData((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    },
    [fetchPositionDetails]
  );

  const handleCloseModal = useCallback(() => {
    setModalData((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  // Dummy handlers for public view
  const dummyHandler = () => {};

  // Show loading state
  if (isLoading || !loaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">{t("geoReport.loading")}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !businessInfo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">{t("geoReport.error.main")}</p>
          <p className="text-gray-600">{t("geoReport.error.sub")}</p>
        </div>
      </div>
    );
  }

  // Create mock underperforming areas (until this data is available from API)
  const mockUnderPerformingAreas =
    rankingData?.rankDetails?.slice(0, 2).map((detail, index) => ({
      id: detail.positionId,
      areaName: `Area ${index + 1}`,
      coordinate: detail.coordinates,
      compRank: 1,
      compName: "Competitor",
      compRating: "4.5",
      compReview: "324",
      priority: index === 0 ? "High" : "Medium",
      youRank: detail.rank.toString(),
      youName: businessInfo.name,
      youRating: "4.2",
      youReview: "156",
    })) || [];

  // Create project details from available data, prioritizing API data
  const projectDetails = {
    id: reportId,
    sab: apiProjectDetails?.sab || "Google Maps",
    keyword:
      apiProjectDetails?.keyword ||
      keywords.find((k) => k.id === selectedKeyword)?.keyword ||
      "",
    mappoint:
      apiProjectDetails?.mappoint ||
      rankingData?.rankDetails?.[0]?.coordinates ||
      "40.7128,-74.0060",
    prev_id: "0",
    distance: apiProjectDetails?.distance || "10 Miles",
    grid: apiProjectDetails?.grid || "3x3",
    last_checked:
      apiProjectDetails?.date || new Date().toISOString().split("T")[0],
    schedule: apiProjectDetails?.schedule || "daily",
    date:
      apiProjectDetails?.date ||
      availableDates?.[0]?.date ||
      new Date().toISOString().split("T")[0],
  };

  // Prepare keyword details for components
  const keywordDetails = {
    rankDetails:
      rankingData?.rankDetails.map((detail) => ({
        coordinate: detail.coordinates,
        positionId: detail.positionId,
        rank: detail.rank.toString(),
      })) || [],
    dates: availableDates,
    rankStats: {
      atr: rankingData?.atr?.toString() || "0",
      atrp: rankingData?.atrp?.toString() || "0",
      solvability: rankingData?.solvability?.toString() || "0",
    },
    projectDetails,
    underPerformingArea: mockUnderPerformingAreas,
  };

  // Transform data for PublicReportLayout
  const transformedReportData = {
    title: t("geoReport.title"),
    listingName: businessInfo.name,
    address: businessInfo.address,
    logo: "",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  return (
    <PublicReportLayout
      title={transformedReportData.title}
      listingName={transformedReportData.listingName}
      address={transformedReportData.address}
      logo={transformedReportData.logo}
      date={transformedReportData.date}
      brandingData={brandingData?.data || null}
      reportId={reportId}
      reportType="geo-ranking"
    >
      <div className="mx-auto space-y-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div data-export-target>
              <GeoRankingHeader
                keywords={keywords}
                selectedKeyword={selectedKeyword}
                selectedDate={availableDates?.[0]?.id || "1"}
                keywordDetails={keywordDetails}
                credits={{ allowedCredit: "0", remainingCredit: 0 }}
                onKeywordChange={handleKeywordChange}
                onDateChange={handleDateChange}
                onClone={dummyHandler}
                onRefresh={dummyHandler}
                onCheckRank={dummyHandler}
                isRefreshing={false}
                refreshProgress={0}
                loading={isLoading}
                keywordChanging={false}
                dateChanging={false}
                error={null}
                isShareableView={true}
                projectName={businessInfo.name}
              />

              <div className="space-y-4 sm:space-y-6">
                <GeoRankingMapSection
                  gridSize={apiProjectDetails?.grid || projectDetails.grid}
                  onMarkerClick={handleMarkerClick}
                  rankDetails={keywordDetails.rankDetails}
                  rankStats={keywordDetails.rankStats}
                  projectDetails={{
                    ...projectDetails,
                    ...apiProjectDetails,
                    prev_id: apiProjectDetails?.id
                      ? "0"
                      : projectDetails.prev_id,
                    last_checked:
                      apiProjectDetails?.date || projectDetails.last_checked,
                  }}
                  loading={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <GeoPositionModal
        isOpen={modalData.isOpen}
        onClose={handleCloseModal}
        gpsCoordinates={modalData.gpsCoordinates}
        competitors={modalData.competitors}
        loading={modalData.loading}
        userBusinessName={businessInfo.name}
      />
    </PublicReportLayout>
  );
};
