import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { GeoRankingReportForm } from "../components/GeoRankingReportForm";
import { GeoRankingReportMap } from "../components/GeoRankingReportMap";
import { useGeoRankingReport } from "@/hooks/useGeoRankingReport";
import { BusinessLocationLite, ProjectLite } from "@/types/business";
import { getDistanceOptions, languageOptions } from "@/utils/geoRankingUtils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

function CheckRanking() {
  const { t } = useI18nNamespace("Geo-Ranking-module-pages/CheckRanking");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlProjectId = searchParams.get("projectId");
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessLocationLite | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectLite | null>(
    null
  );

  // Initialize the geo ranking report hook with a default listingId (will be updated when business is selected)
  const listingId = selectedBusiness
    ? parseInt(selectedBusiness.latitude) || 1
    : 1; // Temporary mapping
  const {
    formData,
    defaultCoordinates,
    gridCoordinates,
    loadingGrid,
    submittingRank,
    pollingKeyword,
    keywordData,
    manualCoordinates,
    handleInputChange,
    handleReset,
    submitCheckRank,
    submitAddKeywords,
    addManualCoordinate,
    removeManualCoordinate,
    updateManualCoordinate,
    clearManualCoordinates,
    fetchGridCoordinates,
    fetchDefaultCoordinates,
    setDefaultCoordinatesFromBusiness,
  } = useGeoRankingReport(listingId, true);
  const handleBusinessSelect = (business: BusinessLocationLite | null) => {
    setSelectedBusiness(business);

    // Update form data when business is selected
    if (business) {
      handleInputChange("searchBusiness", business.name || "");
      handleInputChange("searchBusinessType", "name");

      // For module API, fetch default coordinates after business selection (only for CID/Map URL)
      if (business.type && business.input) {
        fetchDefaultCoordinates(business.type, business.input);
      }

      // Automatically fetch grid coordinates if business has valid lat/lng
      if (business.latitude && business.longitude) {
        const businessCoords = {
          lat: parseFloat(business.latitude),
          lng: parseFloat(business.longitude),
        };

        // Set the coordinates as default coordinates for grid API calls
        setDefaultCoordinatesFromBusiness(businessCoords);

        // Set default grid size and distance for automatic API call
        handleInputChange("gridSize", "3");
        handleInputChange("distanceValue", "100");
        handleInputChange("distanceUnit", "Meters");

        // Trigger grid coordinates API call with business coordinates
        setTimeout(() => {
          fetchGridCoordinates(businessCoords);
        }, 100); // Small delay to ensure form state is updated
      }
    }
  };
  const handleProjectSelect = (project: ProjectLite | null) => {
    setSelectedProject(project);
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness) {
      alert(t("checkRanking.alerts.selectBusiness"));
      return;
    }
    submitCheckRank();
  };

  const handleAddKeywordsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBusiness) {
      alert(t("checkRanking.alerts.selectBusiness"));
      return;
    }
    if (!selectedProject) {
      alert(t("checkRanking.alerts.selectProject"));
      return;
    }

    try {
      const result = await submitAddKeywords(selectedBusiness, selectedProject);

      if (result.success) {
        // If multiple keywords were added, navigate to project details
        if (result.keywordCount >= 1) {
          navigate(
            `/module/geo-ranking/view-project-details/${selectedProject.id}`
          );
        }
        // For single keyword, just show success message (already handled in hook)
      }
    } catch (error) {
      console.error("Error adding keywords:", error);
    }
  };

  // Get default coordinates from selected business or fallback to hook default
  const businessCoordinates =
    selectedBusiness && selectedBusiness.latitude && selectedBusiness.longitude
      ? {
          lat: parseFloat(selectedBusiness.latitude),
          lng: parseFloat(selectedBusiness.longitude),
        }
      : null;
  const effectiveCoordinates = businessCoordinates || defaultCoordinates;

  // Placeholder functions for missing props - memoized to prevent re-renders
  const handleMarkerClick = useCallback(
    (coordinate: string, positionId: string) => {},
    []
  );

  // Get distance options based on current distance unit
  const getDistanceOptionsForUnit = () =>
    getDistanceOptions(formData.distanceUnit);
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t("checkRanking.title")}
        </h1>
        <p className="text-muted-foreground">{t("checkRanking.description")}</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Geo Ranking Map */}
        <div className="col-span-12 lg:col-span-7">
          <GeoRankingReportMap
            defaultCoordinates={effectiveCoordinates}
            gridCoordinates={gridCoordinates}
            rankDetails={null} // Will be populated when results are available
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
        </div>
        <div className="col-span-12 lg:col-span-5">
          {/* Report Configuration Form with Business Search */}
          <GeoRankingReportForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleFormSubmit}
            onReset={handleReset}
            getDistanceOptions={getDistanceOptionsForUnit}
            languageOptions={languageOptions}
            submittingRank={submittingRank}
            pollingKeyword={pollingKeyword}
            manualCoordinates={manualCoordinates}
            onClearManualCoordinates={clearManualCoordinates}
            hasResults={false} // Will be updated when results are available
            onBusinessSelect={handleBusinessSelect}
            onProjectSelect={handleProjectSelect}
            onAddKeywordsSubmit={handleAddKeywordsSubmit}
            urlProjectId={urlProjectId}
          />
        </div>
      </div>

      {!selectedBusiness}
    </div>
  );
}

export default CheckRanking;
