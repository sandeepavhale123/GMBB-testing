import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import L from 'leaflet';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { useBusinessListings } from '../../hooks/useBusinessListings';
import { GeoRankingReportForm } from './GeoRankingReportForm';
import { GeoRankingMap } from './GeoRankingMap';
import { useGeoRankingReport } from '../../hooks/useGeoRankingReport';
import { getDistanceOptions, languageOptions } from '../../utils/geoRankingUtils';

export const GeoRankingReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const numericListingId = listingId ? parseInt(listingId, 10) : 160886;
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { listings } = useBusinessListings();

  const {
    formData,
    defaultCoordinates,
    gridCoordinates,
    loadingGrid,
    currentMarkers,
    setCurrentMarkers,
    submittingRank,
    handleInputChange,
    submitCheckRank
  } = useGeoRankingReport(numericListingId);

  // Get current listing - convert numericListingId to string for comparison
  const currentListing = listings.find(listing => listing.id === numericListingId.toString());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitCheckRank();
    if (result.success) {
      console.log('Rank check submitted successfully');
      // Navigate to GEO ranking page only for multiple keywords
      if (result.shouldNavigate) {
        navigate('/geo-ranking');
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar 
        activeTab="geo-ranking" 
        onTabChange={() => {}} 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header onToggleSidebar={toggleSidebar} />
        
        <div className="p-3 sm:p-4 lg:p-6 px-0 py-0">
          <div className="max-w-7xl mx-auto">
            {/* Listing Header */}
            {currentListing && (
              <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{currentListing.name}</h2>
                    <p className="text-sm text-gray-600">{currentListing.address}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
              {/* Report Configuration */}
              <div className="xl:col-span-4 order-1 xl:order-2">
                <GeoRankingReportForm
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmit}
                  getDistanceOptions={() => getDistanceOptions(formData.distanceUnit)}
                  languageOptions={languageOptions}
                  submittingRank={submittingRank}
                />
              </div>

              {/* Map Section */}
              <div className="xl:col-span-8 order-2 xl:order-1">
                <GeoRankingMap
                  mapPoint={formData.mapPoint}
                  loadingGrid={loadingGrid}
                  defaultCoordinates={defaultCoordinates}
                  gridCoordinates={gridCoordinates}
                  currentMarkers={currentMarkers}
                  setCurrentMarkers={setCurrentMarkers}
                  mapInstanceRef={mapInstanceRef}
                  distanceValue={formData.distanceValue}
                  distanceUnit={formData.distanceUnit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};