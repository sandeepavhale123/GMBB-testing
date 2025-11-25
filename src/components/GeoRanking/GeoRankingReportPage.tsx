import React, { useState, useRef, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin } from "lucide-react";
import L from "leaflet";
import { useBusinessListings } from "../../hooks/useBusinessListings";
import { useGeoRankingReport } from "../../hooks/useGeoRankingReport";
import {
  getDistanceOptions,
  languageOptions,
} from "../../utils/geoRankingUtils";
import { getKeywordPositionDetails } from "../../api/geoRankingApi";
import { useToast } from "../../hooks/use-toast";
import { Progress } from "../ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
const GeoRankingReportForm = React.lazy(() => import('./GeoRankingReportForm'));
const GeoRankingReportMap = React.lazy(() => import("./GeoRankingReportMap"));
const GeoPositionModal = React.lazy(() => import("./GeoPositionModal"));
const UnderPerformingTable = React.lazy(() => import("./UnderPerformingTable"));
const GeoRankingReportPage: React.FC = () => {
  const { t } = useI18nNamespace("GeoRanking/geoRankingReportPage");
  const navigate = useNavigate();
  const { listingId } = useParams();
  const numericListingId = listingId ? parseInt(listingId, 10) : 0;
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { listings } = useBusinessListings();

  const {
    formData,
    defaultCoordinates,
    gridCoordinates,
    loadingGrid,
    currentMarkers,
    setCurrentMarkers,
    manualCoordinates,
    addManualCoordinate,
    removeManualCoordinate,
    clearManualCoordinates,
    updateManualCoordinate,
    submittingRank,
    pollingKeyword,
    pollingProgress,
    keywordData,
    currentKeywordId,
    handleInputChange,
    handleReset,
    submitCheckRank,
  } = useGeoRankingReport(numericListingId);

  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCoordinate, setModalCoordinate] = useState("");
  const [modalCompetitors, setModalCompetitors] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [showMultiKeywordAlert, setShowMultiKeywordAlert] = useState(false);

  // Get current listing - convert numericListingId to string for comparison
  const currentListing = listings.find(
    (listing) => listing.id === numericListingId.toString()
  );

  // Helper function to detect multiple keywords
  const isMultipleKeywords = (keywords: string): boolean => {
    const keywordArray = keywords
      .split(/[,;\n\r]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    return keywordArray.length > 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitCheckRank();
    if (result.success) {
      // Show alert for multiple keywords
      if (result.shouldNavigate && isMultipleKeywords(formData.keywords)) {
        setShowMultiKeywordAlert(true);
      }
    }
  };

  const handleMarkerClick = async (coordinate: string, positionId: string) => {
    setModalCoordinate(coordinate);
    setModalOpen(true);
    setModalLoading(true);

    try {
      if (currentKeywordId) {
        const response = await getKeywordPositionDetails(
          numericListingId,
          currentKeywordId,
          positionId
        );
        if (response.code === 200) {
          const competitors = response.data.keywordDetails.map(
            (detail, index) => ({
              position: detail.position,
              name: detail.name,
              address: detail.address,
              rating: parseFloat(detail.rating) || 0,
              reviewCount: parseInt(detail.review) || 0,
              selected: detail.selected,
            })
          );
          setModalCompetitors(competitors);
        }
      }
    } catch (error) {
      // console.error("Error fetching position details:", error);
      toast({
        title: t("geoRankingReportPage.modal.error.title"),
        description:
          error?.response?.data?.message ||
          t("geoRankingReportPage.modal.error.description"),
        variant: "destructive",
      });
    } finally {
      setModalLoading(false);
    }
  };

  // Check if there are results to determine if reset button should be shown
  const hasResults = Boolean(keywordData?.rankDetails?.length);

  return (
    <div className="p-3 sm:p-4 lg:p-6 px-0 py-0">
      <div className="mx-auto">
        {/* Processing Status Card */}
        {pollingKeyword && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("geoRankingReportPage.processing.title")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("geoRankingReportPage.processing.description")}
                </p>
              </div>
            </div>
            <Progress value={pollingProgress} className="w-full" />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Report Configuration */}
          <div className="xl:col-span-4 order-1 xl:order-2">
            <Suspense fallback={<div>Loading...</div>}>
              <GeoRankingReportForm
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                onReset={handleReset}
                getDistanceOptions={() =>
                  getDistanceOptions(formData.distanceUnit)
                }
                languageOptions={languageOptions}
                submittingRank={submittingRank}
                pollingKeyword={pollingKeyword}
                manualCoordinates={manualCoordinates}
                onClearManualCoordinates={clearManualCoordinates}
                hasResults={hasResults}
              />
            </Suspense>
          </div>

          {/* Map Section */}
          <div className="xl:col-span-8 order-2 xl:order-1">
            <Suspense fallback={<div>Loading...</div>}>
              <GeoRankingReportMap
                defaultCoordinates={defaultCoordinates}
                gridCoordinates={gridCoordinates}
                rankDetails={keywordData?.rankDetails || null}
                pollingKeyword={pollingKeyword}
                loadingGrid={loadingGrid}
                onMarkerClick={handleMarkerClick}
                mapPoint={formData.mapPoint}
                manualCoordinates={manualCoordinates}
                onAddManualCoordinate={addManualCoordinate}
                onRemoveManualCoordinate={removeManualCoordinate}
                onUpdateManualCoordinate={updateManualCoordinate}
                onClearManualCoordinates={clearManualCoordinates}
              />
            </Suspense>
          </div>
        </div>

        {/* Under-Performing Areas Section */}
        {keywordData?.underPerformingArea &&
          keywordData.underPerformingArea.length > 0 && (
            <div className="mt-6">
              <Suspense fallback={<div>Loading...</div>}>
                <UnderPerformingTable
                  underPerformingAreas={keywordData.underPerformingArea}
                  loading={pollingKeyword}
                />
              </Suspense>
            </div>
          )}
      </div>

      {/* Position Modal */}
      <Suspense fallback={<div>Loading...</div>}>
        <GeoPositionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          gpsCoordinates={modalCoordinate}
          competitors={modalCompetitors}
          userBusinessName={currentListing?.name}
          loading={modalLoading}
        />
      </Suspense>

      {/* Multi-Keyword Alert */}
      <AlertDialog
        open={showMultiKeywordAlert}
        onOpenChange={setShowMultiKeywordAlert}
      >
        <AlertDialogContent className="custom-z-index">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {" "}
              {t("geoRankingReportPage.multiKeywordAlert.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("geoRankingReportPage.multiKeywordAlert.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowMultiKeywordAlert(false);
                // Extract submitted keywords and pass as URL parameter
                const submittedKeywords = formData.keywords
                  .split(/[,;\n\r]+/)
                  .map((k) => k.trim())
                  .filter((k) => k.length > 0)
                  .join(",");
                navigate(
                  `/geo-ranking?processing=true&submittedKeywords=${encodeURIComponent(
                    submittedKeywords
                  )}`
                );
              }}
            >
              {t("geoRankingReportPage.multiKeywordAlert.action")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GeoRankingReportPage;
