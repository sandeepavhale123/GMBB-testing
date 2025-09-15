import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportLayout } from '../components/PublicReportLayout';
import { GeoRankingHeader } from '@/components/GeoRanking/GeoRankingHeader';
import { GeoRankingMapSection } from '@/components/GeoRanking/GeoRankingMapSection';
import { UnderPerformingTable } from '@/components/GeoRanking/UnderPerformingTable';
import { GeoPositionModal } from '@/components/GeoRanking/GeoPositionModal';
import { Card, CardContent } from '@/components/ui/card';

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

// Mock data for the GEO ranking report
const mockKeywords = [
  {
    id: '1',
    keyword: 'restaurant near me',
    visibility: 85,
    date: '2024-01-15'
  },
  {
    id: '2', 
    keyword: 'best pizza place',
    visibility: 72,
    date: '2024-01-15'
  },
  {
    id: '3',
    keyword: 'italian food delivery',
    visibility: 91,
    date: '2024-01-15'
  }
];

const mockAvailableDates = [
  {
    id: '1',
    prev_id: '0',
    date: '2024-01-15'
  },
  {
    id: '2', 
    prev_id: '1',
    date: '2024-01-14'
  },
  {
    id: '3',
    prev_id: '2', 
    date: '2024-01-13'
  }
];

const mockProjectDetails = {
  id: '1',
  sab: 'sample',
  keyword: 'restaurant near me',
  mappoint: '40.7128,-74.0060',
  prev_id: '0',
  distance: '10 Miles',
  grid: '3x3',
  last_checked: '2024-01-15',
  schedule: 'daily',
  date: '2024-01-15'
};

const mockRankStats = {
  atr: '85',
  atrp: '75', 
  solvability: '90'
};

const mockRankDetails = [
  {
    coordinate: '40.7128,-74.0060',
    positionId: '1',
    rank: '1'
  },
  {
    coordinate: '40.7130,-74.0062',
    positionId: '2',
    rank: '3'
  },
  {
    coordinate: '40.7126,-74.0058',
    positionId: '3',
    rank: '2'
  },
  {
    coordinate: '40.7132,-74.0064',
    positionId: '4',
    rank: '5'
  },
  {
    coordinate: '40.7124,-74.0056',
    positionId: '5',
    rank: '4'
  }
];

const mockUnderPerformingAreas = [
  {
    id: '1',
    areaName: 'Downtown District',
    coordinate: '40.7132,-74.0064',
    compRank: 1,
    compName: 'Tony\'s Italian Bistro',
    compRating: '4.5',
    compReview: '324',
    priority: 'High',
    youRank: '5',
    youName: 'Mama\'s Italian Restaurant',
    youRating: '4.2',
    youReview: '156'
  },
  {
    id: '2',
    areaName: 'Business Quarter',
    coordinate: '40.7124,-74.0056',
    compRank: 2,
    compName: 'Bella Notte Restaurant',
    compRating: '4.2',
    compReview: '198',
    priority: 'Medium',
    youRank: '4',
    youName: 'Mama\'s Italian Restaurant',
    youRating: '4.2',
    youReview: '156'
  }
];

const mockCompetitors = [
  {
    position: 1,
    name: 'Tony\'s Italian Bistro',
    address: '123 Main St, New York, NY 10001',
    rating: 4.5,
    reviewCount: 324,
    selected: false
  },
  {
    position: 2,
    name: 'Bella Notte Restaurant',
    address: '456 Broadway Ave, New York, NY 10002', 
    rating: 4.2,
    reviewCount: 198,
    selected: true
  },
  {
    position: 3,
    name: 'Giuseppe\'s Pizza Palace',
    address: '789 Central Park West, New York, NY 10003',
    rating: 4.8,
    reviewCount: 542,
    selected: false
  }
];

const mockBrandingData = {
  company_name: 'Mama\'s Italian Restaurant',
  company_email: 'info@mamasitalian.com',
  company_website: 'www.mamasitalian.com',
  company_phone: '(555) 123-4567',
  company_address: '567 Little Italy St, New York, NY 10013',
  company_logo: ''
};

export const LeadGeoRankingReport: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  
  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    gpsCoordinates: '',
    competitors: [],
    loading: false
  });

  const [selectedKeyword, setSelectedKeyword] = useState<string>('1');
  const [selectedDate, setSelectedDate] = useState<string>('1');

  const keywords = mockKeywords;
  const userBusinessName = "Mama's Italian Restaurant";

  // Mock keyword details data
  const keywordDetails = {
    rankDetails: mockRankDetails,
    dates: mockAvailableDates,
    rankStats: mockRankStats,
    projectDetails: mockProjectDetails,
    underPerformingArea: mockUnderPerformingAreas
  };

  // Handle keyword change
  const handleKeywordChange = (keywordId: string) => {
    setSelectedKeyword(keywordId);
  };

  // Handle date change  
  const handleDateChange = (dateId: string) => {
    setSelectedDate(dateId);
  };

  // Mock marker click handler
  const handleMarkerClick = useCallback(async (gpsCoordinates: string, positionId: string) => {
    // Show loading state
    setModalData({
      isOpen: true,
      gpsCoordinates,
      competitors: [],
      loading: true
    });

    // Simulate API delay
    setTimeout(() => {
      setModalData({
        isOpen: true,
        gpsCoordinates,
        competitors: mockCompetitors,
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

  // Transform data for PublicReportLayout
  const transformedReportData = {
    title: "GEO Ranking Report",
    listingName: userBusinessName,
    address: "567 Little Italy St, New York, NY 10013",
    logo: "",
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    })
  };

  return (
    <PublicReportLayout 
      title={transformedReportData.title}
      listingName={transformedReportData.listingName}
      address={transformedReportData.address}
      logo={transformedReportData.logo}
      date={transformedReportData.date}
      brandingData={mockBrandingData}
      reportId={reportId}
      reportType="geo-ranking"
    >
      <div className="mx-auto space-y-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div data-export-target>
              <GeoRankingHeader 
                keywords={keywords}
                selectedKeyword={selectedKeyword}
                selectedDate={selectedDate}
                keywordDetails={keywordDetails}
                credits={{ allowedCredit: '0', remainingCredit: 0 }}
                onKeywordChange={handleKeywordChange}
                onDateChange={handleDateChange}
                onClone={dummyHandler}
                onRefresh={dummyHandler}
                onCheckRank={dummyHandler}
                isRefreshing={false}
                refreshProgress={0}
                loading={false}
                keywordChanging={false}
                dateChanging={false}
                error={null}
                isShareableView={true}
                projectName={userBusinessName}
              />

              <div className="space-y-4 sm:space-y-6">
                <GeoRankingMapSection 
                  gridSize={keywordDetails.projectDetails?.grid || "3x3"}
                  onMarkerClick={handleMarkerClick}
                  rankDetails={keywordDetails.rankDetails}
                  rankStats={keywordDetails.rankStats}
                  projectDetails={keywordDetails.projectDetails}
                  loading={false}
                />

                <UnderPerformingTable 
                  underPerformingAreas={keywordDetails.underPerformingArea}
                  loading={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <GeoPositionModal 
        isOpen={modalData.isOpen}
        onClose={handleCloseModal}
        gpsCoordinates={modalData.gpsCoordinates}
        competitors={modalData.competitors}
        loading={modalData.loading}
        userBusinessName={userBusinessName}
      />
    </PublicReportLayout>
  );
};