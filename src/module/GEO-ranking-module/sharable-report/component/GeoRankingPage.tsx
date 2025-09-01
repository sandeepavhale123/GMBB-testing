import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { GeoRankingHeader } from '@/components/GeoRanking/GeoRankingHeader';
import { GeoRankingMapSection } from '@/components/GeoRanking/GeoRankingMapSection';
import { UnderPerformingTable } from '@/components/GeoRanking/UnderPerformingTable';
import { GeoPositionModal } from '@/components/GeoRanking/GeoPositionModal';
import { Card, CardContent } from '@/components/ui/card';
import { ListingLoader } from '@/components/ui/listing-loader';
import { useShareableGeoKeywords } from '@/hooks/useShareableGeoKeywords';

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

export const ShareableGeoRankingPage: React.FC = () => {
  const { reportId } = useParams();
  
  // Fetch shareable keywords data using the encKey as reportId
  const { data: shareableData, isLoading, error } = useShareableGeoKeywords({ 
    reportId: reportId || '' 
  });

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    gpsCoordinates: '',
    competitors: [],
    loading: false
  });

  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Extract data from API response
  const keywords = shareableData?.data?.keywords?.map(kw => ({
    id: kw.id,
    keyword: kw.keyword,
    visibility: 85, // Default visibility since not provided by API
    date: kw.date
  })) || [];

  const userBusinessName = shareableData?.data?.projectName || "Business Location";

  // Mock data for demonstration - use first keyword if available
  const mockKeywords = keywords.length > 0 ? keywords : [
    { id: '1', keyword: 'Sample Keyword', visibility: 85, date: '2024-01-15' }
  ];

  const mockKeywordDetails = {
    rankDetails: [],
    dates: [],
    rankStats: {
      atr: '85',
      atrp: '75',
      solvability: '90'
    },
    projectDetails: {
      id: '1',
      sab: 'sample',
      keyword: 'Sample Keyword', 
      mappoint: '40.7128,-74.0060',
      prev_id: '0',
      distance: '10',
      grid: '3x3',
      last_checked: '2024-01-15',
      schedule: 'daily',
      rank: '3',
      date: '2024-01-15'
    },
    underPerformingArea: []
  };

  const handleMarkerClick = useCallback(async (gpsCoordinates: string, positionId: string) => {
    setModalData({
      isOpen: true,
      gpsCoordinates,
      competitors: [],
      loading: true
    });

    // Simulate API call delay
    setTimeout(() => {
      setModalData({
        isOpen: true,
        gpsCoordinates,
        competitors: [
          {
            position: 1,
            name: "Sample Business",
            address: "123 Main St",
            rating: 4.5,
            reviewCount: 150,
            selected: true
          }
        ],
        loading: false
      });
    }, 1000);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalData(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  // Dummy handlers for public view
  const dummyHandler = () => {};

  if (isLoading) {
    return <ListingLoader isLoading={true} children={null} />;
  }

  if (error) {
    return (
      <div className="mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
        <Card className="bg-white shadow-sm max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2 text-foreground">Report Not Found</h2>
            <p className="text-muted-foreground">This report may have expired or been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-gray-50 min-h-screen">
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div data-export-target>
            <GeoRankingHeader 
              keywords={keywords.length > 0 ? keywords : mockKeywords} 
              selectedKeyword={selectedKeyword} 
              selectedDate={selectedDate} 
              keywordDetails={mockKeywordDetails} 
              credits={{ allowedCredit: '0', remainingCredit: 0 }} 
              onKeywordChange={setSelectedKeyword} 
              onDateChange={setSelectedDate} 
              onClone={dummyHandler} 
              onRefresh={dummyHandler} 
              onCheckRank={dummyHandler}
              isRefreshing={false} 
              refreshProgress={0} 
              loading={false} 
              keywordChanging={false} 
              dateChanging={false} 
              error={null}
            />

            <div className="space-y-4 sm:space-y-6">
              <GeoRankingMapSection 
                gridSize="3x3" 
                onMarkerClick={handleMarkerClick} 
                rankDetails={mockKeywordDetails.rankDetails} 
                rankStats={mockKeywordDetails.rankStats} 
                projectDetails={mockKeywordDetails.projectDetails} 
                loading={false} 
              />

              <UnderPerformingTable 
                underPerformingAreas={mockKeywordDetails.underPerformingArea} 
                loading={false} 
              />
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