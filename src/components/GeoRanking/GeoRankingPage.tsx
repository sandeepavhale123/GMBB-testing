import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GeoRankingHeader } from './GeoRankingHeader';
import { GeoRankingMapSection } from './GeoRankingMapSection';
import { UnderPerformingTable } from './UnderPerformingTable';
import { GeoPositionModal } from './GeoPositionModal';
import { ProcessingKeywordsAlert } from './ProcessingKeywordsAlert';
import { Card, CardContent } from '../ui/card';
import { ListingLoader } from '../ui/listing-loader';
import { useGeoRanking } from '../../hooks/useGeoRanking';

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

export const GeoRankingPage = () => {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const numericListingId = listingId ? parseInt(listingId, 10) : 0;
  
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
    handleKeywordChange,
    handleDateChange,
    fetchPositionDetails
  } = useGeoRanking(numericListingId);

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    gpsCoordinates: '',
    competitors: [],
    loading: false
  });
  
  const userBusinessName = "Your Digital Agency";

  // Show page loader on initial load
  if (pageLoading) {
    return <ListingLoader isLoading={true} children={null} />;
  }

  const handleCreateReport = () => {
    navigate('/geo-ranking-report');
  };
  
  const handleExportPDF = () => {
    console.log('Exporting report as PDF...');
  };
  
  const handleMarkerClick = async (gpsCoordinates: string, positionId: string) => {
    if (!selectedKeyword) return;

    // Open modal immediately with loading state
    setModalData({
      isOpen: true,
      gpsCoordinates,
      competitors: [],
      loading: true
    });

    try {
      const response = await fetchPositionDetails(selectedKeyword, positionId);
      
      if (response && response.data) {
        // Transform API data to match modal interface
        const transformedCompetitors = response.data.keywordDetails.map(detail => ({
          position: detail.position,
          name: detail.name,
          address: detail.address,
          rating: parseFloat(detail.rating),
          reviewCount: parseInt(detail.review),
          selected: detail.selected
        }));

        setModalData({
          isOpen: true,
          gpsCoordinates: response.data.coordinate,
          competitors: transformedCompetitors,
          loading: false
        });
      } else {
        // Handle error case
        setModalData({
          isOpen: true,
          gpsCoordinates,
          competitors: [],
          loading: false
        });
      }
    } catch (error) {
      console.error('Error fetching position details:', error);
      setModalData({
        isOpen: true,
        gpsCoordinates,
        competitors: [],
        loading: false
      });
    }
  };
  
  const handleCloseModal = () => {
    setModalData(prev => ({
      ...prev,
      isOpen: false
    }));
  };
  
  const selectedKeywordData = keywords.find(k => k.id === selectedKeyword);
  const projectDetails = keywordDetails?.projectDetails;
  
  // Fix grid display to show proper format
  const grid = projectDetails?.grid ? `${projectDetails.grid}` : '3*3';
  
  return (
    <div className="mx-auto bg-gray-50 min-h-screen">
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div data-export-target>
            <ProcessingKeywordsAlert keywords={processingKeywords} />
            
            <GeoRankingHeader
              keywords={keywords}
              selectedKeyword={selectedKeyword}
              selectedDate={selectedDate}
              keywordDetails={keywordDetails}
              credits={credits}
              onKeywordChange={handleKeywordChange}
              onDateChange={handleDateChange}
              loading={keywordsLoading}
              keywordChanging={keywordChanging}
              dateChanging={dateChanging}
              error={error}
            />

            <div className="space-y-4 sm:space-y-6">
              <GeoRankingMapSection 
                gridSize={grid}
                onMarkerClick={handleMarkerClick}
                rankDetails={keywordDetails?.rankDetails || []}
                rankStats={keywordDetails?.rankStats}
                projectDetails={keywordDetails?.projectDetails}
                loading={loading || keywordChanging || dateChanging}
              />

              <UnderPerformingTable 
                underPerformingAreas={keywordDetails?.underPerformingArea || []}
                loading={loading || keywordChanging || dateChanging}
              />

              {/* Powered By Section */}
              <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">Powered by</span>
                <div className="flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/f6f982ce-daf2-42fe-bff3-b78a0c684308.png" 
                    alt="GMB-Briefcase favicon" 
                    className="w-6 h-6"
                  />
                  <span className="text-sm font-medium text-gray-700">GMB-Briefcase</span>
                </div>
              </div>
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
