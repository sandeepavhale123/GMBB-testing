import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportLayout } from '../components/PublicReportLayout';
import { GeoRankingHeader } from '@/components/GeoRanking/GeoRankingHeader';
import { GeoRankingMapSection } from '@/components/GeoRanking/GeoRankingMapSection';
import { UnderPerformingTable } from '@/components/GeoRanking/UnderPerformingTable';
import { GeoPositionModal } from '@/components/GeoRanking/GeoPositionModal';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useGetLeadGeoReport } from '@/api/leadApi';
import { useGetLeadReportBranding } from '@/hooks/useReportBranding';
import { useShareableKeywordDetails } from '@/hooks/useShareableKeywordDetails';
import { useShareableKeywordPositionDetails } from '@/hooks/useShareableKeywordPositionDetails';

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

export const LeadGeoRankingReport: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  
  // Fetch lead GEO report data
  const { data: geoReportData, isLoading, error } = useGetLeadGeoReport(reportId || '');
  
  // Fetch branding data
  const { data: brandingResponse } = useGetLeadReportBranding(reportId || '');

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    gpsCoordinates: '',
    competitors: [],
    loading: false
  });

  const [selectedKeyword, setSelectedKeyword] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Extract data from API response
  const keywords = geoReportData?.data?.keywords?.map(kw => ({
    id: kw.id,
    keyword: kw.keyword,
    visibility: 85, // Default visibility since not provided by API
    date: kw.date
  })) || [];

  const userBusinessName = geoReportData?.data?.projectName || "Business Location";

  // Auto-select first keyword when keywords are loaded
  useEffect(() => {
    if (keywords.length > 0 && !selectedKeyword) {
      setSelectedKeyword(keywords[0].id);
    }
  }, [keywords, selectedKeyword]);

  // Fetch keyword details when keyword is selected
  const { 
    data: keywordDetailsData, 
    isLoading: keywordDetailsLoading, 
    error: keywordDetailsError 
  } = useShareableKeywordDetails({
    reportId: reportId || '',
    keywordId: parseInt(selectedKeyword) || 0,
    enabled: Boolean(selectedKeyword) && Boolean(reportId)
  });

  // Auto-select first date when keyword details are loaded
  useEffect(() => {
    if (keywordDetailsData?.data?.dates && keywordDetailsData.data.dates.length > 0 && !selectedDate) {
      setSelectedDate(keywordDetailsData.data.dates[0].id);
    }
  }, [keywordDetailsData, selectedDate]);

  // Hook for fetching keyword position details
  const { 
    data: positionDetailsData, 
    loading: positionDetailsLoading, 
    error: positionDetailsError,
    fetchPositionDetails 
  } = useShareableKeywordPositionDetails({
    reportId: reportId || '',
    keywordId: parseInt(selectedKeyword) || 0
  });

  // Handle keyword change
  const handleKeywordChange = (keywordId: string) => {
    setSelectedKeyword(keywordId);
    setSelectedDate(''); // Reset selected date when keyword changes
  };

  // Handle date change
  const handleDateChange = (dateId: string) => {
    setSelectedDate(dateId);
  };

  // Get available dates for the selected keyword
  const availableDates = keywordDetailsData?.data?.dates?.map(date => ({
    id: date.id,
    prev_id: date.prev_id,
    date: date.date
  })) || [];

  // Get current keyword details or use mock data
  const keywordDetails = keywordDetailsData?.data || {
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
      date: '2024-01-15',
      coordinate: '40.7128,-74.0060'
    },
    underPerformingArea: []
  };

  const handleMarkerClick = useCallback(async (gpsCoordinates: string, positionId: string) => {
    // Clear previous modal data and show loading
    setModalData({
      isOpen: true,
      gpsCoordinates,
      competitors: [],
      loading: true
    });

    try {
      await fetchPositionDetails(parseInt(positionId));
    } catch (error) {
      console.error('Error fetching position details:', error);
      setModalData({
        isOpen: true,
        gpsCoordinates,
        competitors: [],
        loading: false
      });
    }
  }, [fetchPositionDetails]);

  // Update modal data when position details are fetched
  useEffect(() => {
    if (positionDetailsData?.data && modalData.isOpen) {
      const competitors = positionDetailsData.data.keywordDetails.map(detail => ({
        position: detail.position,
        name: detail.name,
        address: detail.address,
        rating: parseFloat(detail.rating),
        reviewCount: parseInt(detail.review),
        selected: detail.selected
      }));

      setModalData({
        isOpen: true,
        gpsCoordinates: positionDetailsData.data.coordinate,
        competitors,
        loading: false
      });
    }
  }, [positionDetailsData, modalData.isOpen]);

  const handleCloseModal = useCallback(() => {
    setModalData(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  // Dummy handlers for public view
  const dummyHandler = () => {};

  // Use branding data from API or fallback to empty object
  const brandingData = brandingResponse?.data || null;

  if (isLoading || (selectedKeyword && keywordDetailsLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading GEO Ranking Report...</p>
        </div>
      </div>
    );
  }

  if (error || keywordDetailsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading report</p>
          <p className="text-muted-foreground">Please check the report ID and try again.</p>
        </div>
      </div>
    );
  }

  // Transform data for PublicReportLayout
  const transformedReportData = {
    title: "GEO Ranking Report",
    listingName: userBusinessName,
    address: "", // Will be filled from project details if available
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
      brandingData={brandingData}
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
                loading={keywordDetailsLoading} 
                keywordChanging={keywordDetailsLoading} 
                dateChanging={false} 
                error={keywordDetailsError?.message || null}
                isShareableView={true}
                projectName={geoReportData?.data?.projectName}
              />

              <div className="space-y-4 sm:space-y-6">
                <GeoRankingMapSection 
                  gridSize={keywordDetails.projectDetails?.grid || "3x3"} 
                  onMarkerClick={handleMarkerClick} 
                  rankDetails={keywordDetails.rankDetails} 
                  rankStats={keywordDetails.rankStats} 
                  projectDetails={keywordDetails.projectDetails} 
                  loading={keywordDetailsLoading} 
                />

                <UnderPerformingTable 
                  underPerformingAreas={keywordDetails.underPerformingArea} 
                  loading={keywordDetailsLoading} 
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