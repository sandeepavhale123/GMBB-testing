import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { GeoRankingHeader } from './GeoRankingHeader';
import { GeoRankingMapSection } from './GeoRankingMapSection';
import { UnderPerformingTable } from './UnderPerformingTable';
import { GeoPositionModal } from './GeoPositionModal';
import { ProcessingKeywordsAlert } from './ProcessingKeywordsAlert';
import { GeoRankingEmptyState } from './GeoRankingEmptyState';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const numericListingId = listingId ? parseInt(listingId, 10) : 0;
  
  // Get URL parameters for processing state
  const isProcessing = searchParams.get('processing') === 'true';
  const submittedKeywords = searchParams.get('submittedKeywords') || '';
  const submittedKeywordsList = submittedKeywords ? submittedKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0) : [];
  
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
    refreshing,
    refreshError,
    refreshProgress,
    pollingProgress,
    isPollingActive,
    handleKeywordChange,
    handleDateChange,
    handleRefreshKeyword,
    fetchPositionDetails
  } = useGeoRanking(numericListingId);

  // Memoize stable references for map props to prevent re-rendering
  const stableRankDetails = useMemo(() => {
    console.log('🗺️ [GeoRankingPage] Memoizing rankDetails:', keywordDetails?.rankDetails?.length || 0);
    return keywordDetails?.rankDetails || [];
  }, [keywordDetails?.rankDetails]);

  const stableRankStats = useMemo(() => {
    console.log('🗺️ [GeoRankingPage] Memoizing rankStats:', !!keywordDetails?.rankStats);
    return keywordDetails?.rankStats || null;
  }, [keywordDetails?.rankStats]);

  const stableProjectDetails = useMemo(() => {
    console.log('🗺️ [GeoRankingPage] Memoizing projectDetails:', !!keywordDetails?.projectDetails);
    return keywordDetails?.projectDetails || null;
  }, [keywordDetails?.projectDetails]);

  const stableUnderPerformingAreas = useMemo(() => {
    return keywordDetails?.underPerformingArea || [];
  }, [keywordDetails?.underPerformingArea]);

  const [modalData, setModalData] = useState<ModalData>({
    isOpen: false,
    gpsCoordinates: '',
    competitors: [],
    loading: false
  });
  
  const userBusinessName = "Your Digital Agency";

  // Memoized callback for marker clicks to prevent map re-renders
  const handleMarkerClick = useCallback(async (gpsCoordinates: string, positionId: string) => {
    if (!selectedKeyword) return;

    console.log('🗺️ [GeoRankingPage] Marker clicked:', { gpsCoordinates, positionId });

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
  }, [selectedKeyword, fetchPositionDetails]);

  const handleCreateReport = useCallback(() => {
    navigate('/geo-ranking-report');
  }, [navigate]);

  const handleCheckRank = useCallback(() => {
    if (numericListingId) {
      navigate(`/geo-ranking-report/${numericListingId}`);
    } else {
      navigate('/geo-ranking-report');
    }
  }, [navigate, numericListingId]);

  const handleClone = useCallback(() => {
    if (!selectedKeyword) return;
    
    const currentKeyword = keywords.find(k => k.id === selectedKeyword);
    if (!currentKeyword) return;

    // Prepare clone data
    const cloneData = {
      clone: 'true',
      keywordId: selectedKeyword,
      keyword: currentKeyword.keyword,
      ...(selectedDate && { date: selectedDate }),
      ...(keywordDetails?.projectDetails?.distance && { distance: keywordDetails.projectDetails.distance }),
      ...(keywordDetails?.projectDetails?.grid && { grid: keywordDetails.projectDetails.grid }),
      ...(keywordDetails?.projectDetails?.schedule && { schedule: keywordDetails.projectDetails.schedule }),
      ...(keywordDetails?.projectDetails?.mappoint && { mapPoint: keywordDetails.projectDetails.mappoint })
    };

    // Navigate to report page with keyword data as URL params, including listingId in path
    const params = new URLSearchParams(cloneData);
    
    navigate(`/geo-ranking-report/${numericListingId}?${params.toString()}`);
  }, [selectedKeyword, keywords, selectedDate, keywordDetails, navigate, numericListingId]);

  const handleCloseModal = useCallback(() => {
    setModalData(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  // Clear URL parameters after initial processing setup
  useEffect(() => {
    if (isProcessing && submittedKeywordsList.length > 0) {
      // Clear the URL parameters after a brief delay to allow the processing alert to show
      const timer = setTimeout(() => {
        setSearchParams({});
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isProcessing, submittedKeywordsList.length, setSearchParams]);

  // Show page loader on initial load - after all hooks
  if (pageLoading) {
    return <ListingLoader isLoading={true} children={null} />;
  }

  // Show empty state when no keywords exist
  if (keywords.length === 0 && !keywordsLoading) {
    return (
      <div className="mx-auto bg-gray-50 min-h-screen">
        <GeoRankingEmptyState 
          onCheckRank={handleCheckRank}
          credits={credits}
        />
      </div>
    );
  }
  
  const selectedKeywordData = keywords.find(k => k.id === selectedKeyword);
  const projectDetails = keywordDetails?.projectDetails;
  
  // Fix grid display to show proper format
  const grid = projectDetails?.grid ? `${projectDetails.grid}` : '3*3';
  
  return (
    <div className="mx-auto bg-gray-50 min-h-screen">
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div data-export-target>
            <ProcessingKeywordsAlert 
              keywords={processingKeywords} 
              progress={pollingProgress}
              isPolling={isPollingActive || isPolling}
              submittedKeywords={submittedKeywordsList}
              isNewSubmission={isProcessing}
            />
            
            <GeoRankingHeader
              keywords={keywords}
              selectedKeyword={selectedKeyword}
              selectedDate={selectedDate}
              keywordDetails={keywordDetails}
              credits={credits}
              onKeywordChange={handleKeywordChange}
              onDateChange={handleDateChange}
              onClone={handleClone}
              onRefresh={handleRefreshKeyword}
              isRefreshing={refreshing}
              refreshProgress={refreshProgress}
              loading={keywordsLoading}
              keywordChanging={keywordChanging}
              dateChanging={dateChanging}
              error={error}
            />

            <div className="space-y-4 sm:space-y-6">
              <GeoRankingMapSection 
                gridSize={grid}
                onMarkerClick={handleMarkerClick}
                rankDetails={stableRankDetails}
                rankStats={stableRankStats}
                projectDetails={stableProjectDetails}
                loading={loading || keywordChanging || dateChanging}
              />

              <UnderPerformingTable 
                underPerformingAreas={stableUnderPerformingAreas}
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
