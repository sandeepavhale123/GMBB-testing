import React, { useState, useCallback, useEffect, Suspense } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { GeoRankingHeader } from "./GeoRankingHeader";
// import { GeoRankingMapSection } from "./GeoRankingMapSection";
// import { UnderPerformingTable } from "./UnderPerformingTable";
// import { GeoPositionModal } from "./GeoPositionModal";
// import { ProcessingKeywordsAlert } from "./ProcessingKeywordsAlert";
// import { GeoRankingEmptyState } from "./GeoRankingEmptyState";
import { Card, CardContent } from "../ui/card";
import { ListingLoader } from "../ui/listing-loader";
import { useGeoRanking } from "../../hooks/useGeoRanking";
import { useProjectGeoRanking } from "../../hooks/useProjectGeoRanking";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

// Lazy utility
import { lazyImport } from "@/utils/lazyImport";

// Lazy-loaded components
const GeoRankingHeader = lazyImport(() =>
  import("./GeoRankingHeader").then((m) => ({ default: m.GeoRankingHeader }))
);

const GeoRankingMapSection = lazyImport(() =>
  import("./GeoRankingMapSection").then((m) => ({
    default: m.GeoRankingMapSection,
  }))
);

const UnderPerformingTable = lazyImport(() =>
  import("./UnderPerformingTable")
);

const GeoPositionModal = lazyImport(() =>
  import("./GeoPositionModal")
);

const ProcessingKeywordsAlert = lazyImport(() =>
  import("./ProcessingKeywordsAlert").then((m) => ({
    default: m.ProcessingKeywordsAlert,
  }))
);

const GeoRankingEmptyState = lazyImport(() =>
  import("./GeoRankingEmptyState").then((m) => ({
    default: m.GeoRankingEmptyState,
  }))
);

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

interface GeoRankingPageProps {
  projectId?: number;
  isProjectMode?: boolean;
}

export const GeoRankingPage: React.FC<GeoRankingPageProps> = ({
  projectId,
  isProjectMode = false,
}) => {
  const { t } = useI18nNamespace("GeoRanking/geoRankingPage");
  const navigate = useNavigate();
  const { listingId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const numericListingId = listingId ? parseInt(listingId, 10) : 0;
  const effectiveId = isProjectMode ? projectId || 0 : numericListingId;

  // Get URL parameters for processing state
  const isProcessing = searchParams.get("processing") === "true";
  const submittedKeywords = searchParams.get("submittedKeywords") || "";
  const submittedKeywordsList = submittedKeywords
    ? submittedKeywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0)
    : [];

  // Use project-specific hook when in project mode, otherwise use regular hook
  const geoRankingData =
    isProjectMode && projectId
      ? useProjectGeoRanking(projectId)
      : useGeoRanking(numericListingId);

  const {
    keywords,
    selectedKeyword,
    selectedDate,
    keywordDetails,
    credits,
    loading,
    keywordsLoading,
    pageLoading,
    keywordChanging,
    dateChanging,
    error,
    processingKeywords,
    isPolling,
    refreshing,
    refreshError,
    refreshProgress,
    pollingProgress,
    handleRefreshKeyword,
    fetchPositionDetails,
    fetchKeywords,
  } = geoRankingData;

  // Normalize the interface differences between hooks
  const refreshPollingActive =
    "refreshPollingActive" in geoRankingData
      ? geoRankingData.refreshPollingActive
      : geoRankingData.isPolling;

  const onKeywordChange =
    "onKeywordChange" in geoRankingData
      ? geoRankingData.onKeywordChange
      : geoRankingData.handleKeywordChange;

  const onDateChange =
    "onDateChange" in geoRankingData
      ? geoRankingData.onDateChange
      : geoRankingData.handleDateChange;

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    gpsCoordinates: "",
    competitors: [],
    loading: false,
  });

  const userBusinessName = "Your Digital Agency";

  // Memoized callback for marker clicks to prevent map re-renders
  const handleMarkerClick = useCallback(
    async (gpsCoordinates: string, positionId: string) => {
      if (!selectedKeyword) return;

      // Open modal immediately with loading state
      setModalData({
        isOpen: true,
        gpsCoordinates,
        competitors: [],
        loading: true,
      });

      try {
        const response = await fetchPositionDetails(
          selectedKeyword,
          positionId
        );
        if (response && response.data) {
          // Transform API data to match modal interface
          const transformedCompetitors = response.data.keywordDetails.map(
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
            gpsCoordinates: response.data.coordinate,
            competitors: transformedCompetitors,
            loading: false,
          });
        } else {
          // Handle error case
          setModalData({
            isOpen: true,
            gpsCoordinates,
            competitors: [],
            loading: false,
          });
        }
      } catch (error) {
        // console.error("Error fetching position details:", error);
        setModalData({
          isOpen: true,
          gpsCoordinates,
          competitors: [],
          loading: false,
        });
      }
    },
    [selectedKeyword, fetchPositionDetails]
  );

  const handleCreateReport = useCallback(() => {
    navigate("/geo-ranking-report");
  }, [navigate]);

  const handleCheckRank = useCallback(() => {
    if (isProjectMode) {
      navigate("/module/geo-ranking/check-rank");
    } else {
      if (effectiveId) {
        navigate(`/geo-ranking-report/${effectiveId}`);
      } else {
        navigate("/geo-ranking-report");
      }
    }
  }, [navigate, effectiveId, isProjectMode]);

  const handleClone = useCallback(() => {
    if (!selectedKeyword) return;
    const currentKeyword = keywords.find((k) => k.id === selectedKeyword);
    if (!currentKeyword) return;

    // Prepare clone data
    const cloneData = {
      clone: "true",
      keywordId: selectedKeyword,
      keyword: currentKeyword.keyword,
      ...(selectedDate && {
        date: selectedDate,
      }),
      ...(keywordDetails?.projectDetails?.distance && {
        distance: keywordDetails.projectDetails.distance,
      }),
      ...(keywordDetails?.projectDetails?.grid && {
        grid: keywordDetails.projectDetails.grid,
      }),
      ...(keywordDetails?.projectDetails?.schedule && {
        schedule: keywordDetails.projectDetails.schedule,
      }),
      ...(keywordDetails?.projectDetails?.mappoint && {
        mapPoint: keywordDetails.projectDetails.mappoint,
      }),
    };

    // Navigate to report page with keyword data as URL params
    const params = new URLSearchParams(cloneData);
    const path = isProjectMode
      ? `/module/geo-ranking/check-rank?${params.toString()}`
      : `/geo-ranking-report/${effectiveId}?${params.toString()}`;
    navigate(path);
  }, [
    selectedKeyword,
    keywords,
    selectedDate,
    keywordDetails,
    navigate,
    effectiveId,
    isProjectMode,
  ]);

  const handleCloseModal = useCallback(() => {
    setModalData((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const handleDeleteSuccess = useCallback(() => {
    fetchKeywords?.();
  }, [fetchKeywords]);

  // Clear URL parameters after initial processing setup
  useEffect(() => {
    if (isProcessing && submittedKeywordsList.length > 0) {
      // Clear the URL parameters after a brief delay to allow the processing alert to show
      const timer = setTimeout(() => {
        setSearchParams({});
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isProcessing, submittedKeywordsList.length, setSearchParams]);

  // Show page loader on initial load - after all hooks
  if (pageLoading) {
    return <ListingLoader isLoading={true} children={null} />;
  }

  if (isPolling && keywords.length === 0) {
    return (
      <div className="mx-auto  min-h-screen">
        {/* <Card className="bg-white shadow-sm">
          <CardContent className="p-4 sm:p-6 text-center">
              <h1>Keywords Being Processed</h1>
          </CardContent>
        </Card> */}
        <Suspense fallback={<ListingLoader isLoading={true} children={""} />}>
          <ProcessingKeywordsAlert
            keywords={processingKeywords}
            progress={pollingProgress}
            isPolling={refreshPollingActive || isPolling}
            submittedKeywords={submittedKeywordsList}
            isNewSubmission={isProcessing}
          />
        </Suspense>
      </div>
    );
  }

  // Show empty state when no keywords exist
  if (keywords.length === 0 && !keywordsLoading && !isPolling) {
    return (
      <div className="mx-auto bg-gray-50 min-h-screen">
        <GeoRankingEmptyState onCheckRank={handleCheckRank} credits={credits} />
      </div>
    );
  }

  const selectedKeywordData = keywords.find((k) => k.id === selectedKeyword);
  const projectDetails = keywordDetails?.projectDetails;

  // Fix grid display to show proper format
  const grid = projectDetails?.grid ? `${projectDetails.grid}` : "3*3";

  return (
    <div className="mx-auto bg-gray-50 min-h-screen">
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div data-export-target>
            <Suspense fallback={<ListingLoader isLoading={true} />}>
              <ProcessingKeywordsAlert
                keywords={processingKeywords}
                progress={pollingProgress}
                isPolling={refreshPollingActive || isPolling}
                submittedKeywords={submittedKeywordsList}
                isNewSubmission={isProcessing}
              />
            </Suspense>
            <Suspense fallback={<ListingLoader isLoading={true} />}>
              <GeoRankingHeader
                keywords={keywords}
                selectedKeyword={selectedKeyword}
                selectedDate={selectedDate}
                keywordDetails={keywordDetails}
                credits={credits}
                onKeywordChange={onKeywordChange}
                onDateChange={onDateChange}
                onClone={handleClone}
                onRefresh={handleRefreshKeyword}
                onCheckRank={handleCheckRank}
                isRefreshing={refreshing}
                refreshProgress={refreshProgress}
                loading={keywordsLoading}
                keywordChanging={keywordChanging}
                dateChanging={dateChanging}
                error={error}
                projectId={projectId}
                onDeleteSuccess={handleDeleteSuccess}
              />
            </Suspense>

            <div className="space-y-4 sm:space-y-6">
              <Suspense fallback={<ListingLoader isLoading={true} />}>
                <GeoRankingMapSection
                  gridSize={grid}
                  onMarkerClick={handleMarkerClick}
                  rankDetails={keywordDetails?.rankDetails || []}
                  rankStats={keywordDetails?.rankStats}
                  projectDetails={keywordDetails?.projectDetails}
                  loading={loading || keywordChanging || dateChanging}
                  showKeywordsLink={!isProjectMode}
                  listingId={listingId}
                />
              </Suspense>

              <Suspense fallback={<ListingLoader isLoading={true} />}>
                <UnderPerformingTable
                  underPerformingAreas={
                    keywordDetails?.underPerformingArea || []
                  }
                  loading={loading || keywordChanging || dateChanging}
                />
              </Suspense>
            </div>
          </div>
        </CardContent>
      </Card>
      <Suspense fallback={null}>
        <GeoPositionModal
          isOpen={modalData.isOpen}
          onClose={handleCloseModal}
          gpsCoordinates={modalData.gpsCoordinates}
          competitors={modalData.competitors}
          loading={modalData.loading}
          userBusinessName={userBusinessName}
        />
      </Suspense>
    </div>
  );
};
