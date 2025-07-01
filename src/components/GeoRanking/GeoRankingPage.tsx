import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GeoRankingHeader } from './GeoRankingHeader';
import { GeoRankingMapSection } from './GeoRankingMapSection';
import { UnderPerformingTable } from './UnderPerformingTable';
import { GeoPositionModal } from './GeoPositionModal';
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
    isUserBusiness?: boolean;
  }>;
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
    handleKeywordChange,
    handleDateChange
  } = useGeoRanking(numericListingId);

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    gpsCoordinates: '',
    competitors: []
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
  
  const generateCompetitorData = (gridId: string) => {
    const baseCompetitors = [
      {
        name: 'J K Digitech',
        address: 'Laxmi Nagar, Delhi, India',
        rating: 4.8,
        reviewCount: 127
      },
      {
        name: 'Digital Bytz',
        address: 'Connaught Place, New Delhi, India',
        rating: 4.6,
        reviewCount: 89
      },
      {
        name: 'PUNK DIGITAL MARKETING ACADEMY',
        address: 'Janakpuri, Delhi, India',
        rating: 4.7,
        reviewCount: 156
      },
      {
        name: userBusinessName,
        address: 'Karol Bagh, Delhi, India',
        rating: 4.5,
        reviewCount: 94,
        isUserBusiness: true
      },
      {
        name: 'TechnoVista Digital',
        address: 'Rajouri Garden, Delhi, India',
        rating: 4.9,
        reviewCount: 203
      }
    ];
    
    return baseCompetitors.slice(0, 5).map((competitor, index) => ({
      ...competitor,
      position: index + 1
    }));
  };
  
  const handleMarkerClick = (gpsCoordinates: string, gridId: string) => {
    const competitors = generateCompetitorData(gridId);
    setModalData({
      isOpen: true,
      gpsCoordinates,
      competitors
    });
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
        userBusinessName={userBusinessName} 
      />
    </div>
  );
};
