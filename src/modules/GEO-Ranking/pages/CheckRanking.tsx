import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { BusinessSearchForm } from '@/components/BusinessSearch/BusinessSearchForm';

export const CheckRanking: React.FC = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);

  // Temporarily simplified to isolate TypeScript error
  const formData = {
    searchBusinessType: '',
    searchBusiness: '',
    searchDataEngine: 'Briefcase API',
    keywords: '',
    mapPoint: 'Automatic',
    distanceUnit: 'Meters',
    distanceValue: '100',
    gridSize: '5',
    scheduleCheck: 'onetime',
    language: 'en'
  };

  const handleInputChange = (field: string, value: string) => {
    console.log('Field changed:', field, value);
  };

  const handleReset = () => {
    setSelectedBusiness(null);
  };

  const submitCheckRank = () => {
    console.log('Submit check rank');
  };

  const handleBusinessSelect = (business: any) => {
    setSelectedBusiness(business);
    
    // Simplified for testing
    if (business) {
      handleInputChange('searchBusiness', business.business_name || '');
      handleInputChange('searchBusinessType', 'name');
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

  // Get default coordinates - simplified
  const defaultCoordinates = selectedBusiness && selectedBusiness.lat && selectedBusiness.long 
    ? { lat: parseFloat(selectedBusiness.lat), lng: parseFloat(selectedBusiness.long) }
    : null;

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
        

        {/* Geo Ranking Map - Simplified */}
        <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Map will be displayed here</p>
        </div>

        <div><BusinessSearchForm
          onBusinessSelect={handleBusinessSelect}
        />
        {/* Report Configuration Form - Simplified */}
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Report Configuration</h3>
          <p className="text-sm text-muted-foreground">Form will be displayed here</p>
        </div>
          </div>
      </div>

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