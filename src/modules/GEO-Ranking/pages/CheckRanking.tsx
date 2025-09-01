import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { GeoRankingReportForm } from '../components/GeoRankingReportForm';
import { GeoRankingReportMap } from '../components/GeoRankingReportMap';
import { useGeoRankingReport } from '@/hooks/useGeoRankingReport';
import { BusinessLocationLite, ProjectLite } from '@/types/business';
import { getDistanceOptions, languageOptions } from '@/utils/geoRankingUtils';
export function CheckRanking() {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessLocationLite | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectLite | null>(null);

  // Initialize the geo ranking report hook with a default listingId (will be updated when business is selected)
  const listingId = selectedBusiness ? parseInt(selectedBusiness.latitude) || 1 : 1; // Temporary mapping
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
    addManualCoordinate,
    removeManualCoordinate,
    updateManualCoordinate,
    clearManualCoordinates,
    fetchGridCoordinates,
    fetchDefaultCoordinates
  } = useGeoRankingReport(listingId, true);
  const handleBusinessSelect = (business: BusinessLocationLite | null) => {
    setSelectedBusiness(business);

    // Update form data when business is selected
    if (business) {
      handleInputChange('searchBusiness', business.name || '');
      handleInputChange('searchBusinessType', 'name');

      // For module API, fetch default coordinates after business selection (only for CID/Map URL)
      if (business.type && business.input) {
        fetchDefaultCoordinates(business.type, business.input);
      }

      // Automatically fetch grid coordinates if business has valid lat/lng
      if (business.latitude && business.longitude) {
        const businessCoords = {
          lat: parseFloat(business.latitude),
          lng: parseFloat(business.longitude)
        };

        // Set default grid size and distance for automatic API call
        handleInputChange('gridSize', '5');
        handleInputChange('distanceValue', '100');
        handleInputChange('distanceUnit', 'Meters');

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
      alert('Please select a business first');
      return;
    }
    submitCheckRank();
  };

  // Get default coordinates from selected business or fallback to hook default
  const businessCoordinates = selectedBusiness && selectedBusiness.latitude && selectedBusiness.longitude ? {
    lat: parseFloat(selectedBusiness.latitude),
    lng: parseFloat(selectedBusiness.longitude)
  } : null;
  const effectiveCoordinates = businessCoordinates || defaultCoordinates;

  // Placeholder functions for missing props
  const handleMarkerClick = (coordinate: string, positionId: string) => {
    console.log('Marker clicked:', coordinate, positionId);
  };
  
  // Get distance options based on current distance unit
  const getDistanceOptionsForUnit = () => getDistanceOptions(formData.distanceUnit);
  return <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Check Rank</h1>
        <p className="text-muted-foreground">Monitor your local search rankings across different locations</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Geo Ranking Map */}
         <div className="col-span-12 md:col-span-7">
            <GeoRankingReportMap defaultCoordinates={effectiveCoordinates} gridCoordinates={gridCoordinates} rankDetails={null} // Will be populated when results are available
      pollingKeyword={pollingKeyword} loadingGrid={loadingGrid} onMarkerClick={handleMarkerClick} mapPoint={formData.mapPoint} manualCoordinates={manualCoordinates} onAddManualCoordinate={addManualCoordinate} onRemoveManualCoordinate={removeManualCoordinate} onUpdateManualCoordinate={updateManualCoordinate} onClearManualCoordinates={clearManualCoordinates} />
         </div>
<div className="col-span-12 md:col-span-5">
        {/* Report Configuration Form with Business Search */}
        <GeoRankingReportForm formData={formData} onInputChange={handleInputChange} onSubmit={handleFormSubmit} onReset={handleReset} getDistanceOptions={getDistanceOptionsForUnit} languageOptions={languageOptions} submittingRank={submittingRank} pollingKeyword={pollingKeyword} manualCoordinates={manualCoordinates} onClearManualCoordinates={clearManualCoordinates} hasResults={false} // Will be updated when results are available
      onBusinessSelect={handleBusinessSelect} onProjectSelect={handleProjectSelect} />
      </div>
      </div>

      {!selectedBusiness}
    </div>;
}