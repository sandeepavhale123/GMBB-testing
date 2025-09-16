import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportLayout } from '../components/PublicReportLayout';
import { GeoRankingHeader } from '@/components/GeoRanking/GeoRankingHeader';
import { GeoRankingMapSection } from '@/components/GeoRanking/GeoRankingMapSection';
import { UnderPerformingTable } from '@/components/GeoRanking/UnderPerformingTable';
import { GeoPositionModal } from '@/components/GeoRanking/GeoPositionModal';
import { Card, CardContent } from '@/components/ui/card';
import { useLeadGeoRanking } from '@/hooks/useLeadGeoRanking';
import { useGetLeadReportBranding } from '@/api/leadApi';

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

// Mock competitors data for modal (since we don't have competitor details API yet)
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

export const LeadGeoRankingReport: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  
  // Use the lead geo ranking hook for real data
  const {
    keywords,
    businessInfo,
    rankingData,
    availableDates,
    selectedKeyword,
    isLoading,
    error,
    handleKeywordChange,
    handleDateChange,
    setSelectedKeyword
  } = useLeadGeoRanking(reportId || '');

  // Get branding data
  const { data: brandingData } = useGetLeadReportBranding(reportId || '');
  
  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    gpsCoordinates: '',
    competitors: [],
    loading: false
  });

  // Set first keyword as default when data loads
  useEffect(() => {
    if (keywords.length > 0 && !selectedKeyword) {
      setSelectedKeyword(keywords[0].id);
    }
  }, [keywords, selectedKeyword, setSelectedKeyword]);

  // Mock marker click handler (until competitor details API is available)
  const handleMarkerClick = useCallback(async (gpsCoordinates: string, positionId: string) => {
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading GEO Ranking Report...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !businessInfo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">Error loading report data</p>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  // Create mock underperforming areas (until this data is available from API)
  const mockUnderPerformingAreas = rankingData?.rankDetails?.slice(0, 2).map((detail, index) => ({
    id: detail.positionId,
    areaName: `Area ${index + 1}`,
    coordinate: detail.coordinates,
    compRank: 1,
    compName: mockCompetitors[0]?.name || 'Competitor',
    compRating: '4.5',
    compReview: '324',
    priority: index === 0 ? 'High' : 'Medium',
    youRank: detail.rank.toString(),
    youName: businessInfo.name,
    youRating: '4.2',
    youReview: '156'
  })) || [];

  // Create project details from available data
  const projectDetails = {
    id: reportId,
    sab: 'sample',
    keyword: keywords.find(k => k.id === selectedKeyword)?.keyword || '',
    mappoint: rankingData?.rankDetails?.[0]?.coordinates || '40.7128,-74.0060',
    prev_id: '0',
    distance: '10 Miles', // Mock value
    grid: '3x3', // Mock value
    last_checked: new Date().toISOString().split('T')[0],
    schedule: 'daily',
    date: availableDates?.[0]?.date || new Date().toISOString().split('T')[0]
  };

  // Prepare keyword details for components
  const keywordDetails = {
    rankDetails: rankingData?.rankDetails.map(detail => ({
      coordinate: detail.coordinates,
      positionId: detail.positionId,
      rank: detail.rank.toString()
    })) || [],
    dates: availableDates,
    rankStats: {
      atr: rankingData?.atr?.toString() || '0',
      atrp: rankingData?.atrp?.toString() || '0',
      solvability: rankingData?.solvability?.toString() || '0'
    },
    projectDetails,
    underPerformingArea: mockUnderPerformingAreas
  };

  // Transform data for PublicReportLayout
  const transformedReportData = {
    title: "GEO Ranking Report",
    listingName: businessInfo.name,
    address: businessInfo.address,
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
      brandingData={brandingData?.data || null}
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
                selectedDate={availableDates?.[0]?.id || '1'}
                keywordDetails={keywordDetails}
                credits={{ allowedCredit: '0', remainingCredit: 0 }}
                onKeywordChange={handleKeywordChange}
                onDateChange={handleDateChange}
                onClone={dummyHandler}
                onRefresh={dummyHandler}
                onCheckRank={dummyHandler}
                isRefreshing={false}
                refreshProgress={0}
                loading={isLoading}
                keywordChanging={false}
                dateChanging={false}
                error={null}
                isShareableView={true}
                projectName={businessInfo.name}
              />

              <div className="space-y-4 sm:space-y-6">
                <GeoRankingMapSection 
                  gridSize={projectDetails.grid}
                  onMarkerClick={handleMarkerClick}
                  rankDetails={keywordDetails.rankDetails}
                  rankStats={keywordDetails.rankStats}
                  projectDetails={keywordDetails.projectDetails}
                  loading={isLoading}
                />

                <UnderPerformingTable 
                  underPerformingAreas={keywordDetails.underPerformingArea}
                  loading={isLoading}
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
        userBusinessName={businessInfo.name}
      />
    </PublicReportLayout>
  );
};