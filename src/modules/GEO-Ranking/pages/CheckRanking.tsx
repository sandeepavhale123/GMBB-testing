import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { BusinessSearchForm } from '@/components/BusinessSearch/BusinessSearchForm';
import { GeoRankingReportForm } from '../components/GeoRankingReportForm';
import { GeoRankingReportMap } from '../components/GeoRankingReportMap';
import { useGeoRankingReport } from '@/hooks/useGeoRankingReport';
import type { BusinessDetails } from '@/api/businessSearchApi';

export const CheckRanking: React.FC = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessDetails | null>(null);

  // Initialize the geo ranking report hook with a default listingId (will be updated when business is selected)
  const listingId = selectedBusiness ? parseInt(selectedBusiness.lat) || 1 : 1; // Temporary mapping
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
    fetchDefaultCoordinates,
  } = useGeoRankingReport(listingId, true);

  const handleBusinessSelect = (business: BusinessDetails | null) => {
    setSelectedBusiness(business);
    
    // Update form data when business is selected
    if (business) {
      handleInputChange('searchBusiness', business.business_name || '');
      handleInputChange('searchBusinessType', 'name');
      
      // For module API, fetch default coordinates after business selection
      fetchDefaultCoordinates();
      
      // Automatically fetch grid coordinates if business has valid lat/lng
      if (business.lat && business.long) {
        const businessCoords = {
          lat: parseFloat(business.lat),
          lng: parseFloat(business.long)
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBusiness) {
      alert('Please select a business first');
      return;
    }

    submitCheckRank();
  };

  // Get default coordinates from selected business or fallback to hook default
  const businessCoordinates = selectedBusiness && selectedBusiness.lat && selectedBusiness.long 
    ? { lat: parseFloat(selectedBusiness.lat), lng: parseFloat(selectedBusiness.long) }
    : null;

  const effectiveCoordinates = businessCoordinates || defaultCoordinates;

  // Placeholder functions for missing props
  const handleMarkerClick = (coordinate: string, positionId: string) => {
    console.log('Marker clicked:', coordinate, positionId);
  };

  const getDistanceOptions = () => [
    { value: "100", label: "100m" },
    { value: "500", label: "500m" },
    { value: "1000", label: "1km" },
    { value: "5000", label: "5km" },
  ];

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Check Rank</h1>
        <p className="text-muted-foreground">Monitor your local search rankings across different locations</p>
      </div>

      {/* Business Search Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BusinessSearchForm
          onBusinessSelect={handleBusinessSelect}
        />

        {/* Geo Ranking Map */}
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

      {/* Report Configuration Form */}
      <GeoRankingReportForm
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleFormSubmit}
        onReset={handleReset}
        getDistanceOptions={getDistanceOptions}
        languageOptions={languageOptions}
        submittingRank={submittingRank}
        pollingKeyword={pollingKeyword}
        manualCoordinates={manualCoordinates}
        onClearManualCoordinates={clearManualCoordinates}
        hasResults={false} // Will be updated when results are available
      />

      {/* Status Information */}
      {selectedBusiness && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Selected Business:</strong> {selectedBusiness.business_name}
            {selectedBusiness.lat && selectedBusiness.long && (
              <span className="block text-sm mt-1">
                Location: {parseFloat(selectedBusiness.lat).toFixed(6)}, {parseFloat(selectedBusiness.long).toFixed(6)}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {!selectedBusiness && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Please select a business above to start checking rankings. The geo ranking functionality 
            will use the selected business location as the center point for analysis.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};