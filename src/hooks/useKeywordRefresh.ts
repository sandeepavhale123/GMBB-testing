import { useState } from 'react';
import { getKeywordDetails, refreshKeyword } from '../api/geoRankingApi';
import { useToast } from './use-toast';

interface UseKeywordRefreshProps {
  listingId: number;
  selectedKeyword: string;
  onKeywordsUpdate: (selectKeywordId?: string) => Promise<void>;
  onKeywordDetailsUpdate: (data: any) => void;
  onDateUpdate: (dateId: string) => void;
}

export const useKeywordRefresh = ({
  listingId,
  selectedKeyword,
  onKeywordsUpdate,
  onKeywordDetailsUpdate,
  onDateUpdate
}: UseKeywordRefreshProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRefreshKeyword = async () => {
    if (!listingId || !selectedKeyword) return;
    
    setRefreshing(true);
    setRefreshError(null);
    
    try {
      // Call refresh keyword API
      const refreshResponse = await refreshKeyword({
        listingId,
        keywordId: selectedKeyword
      });
      
      if (refreshResponse.code === 200) {
        const newKeywordId = refreshResponse.data.keywordId.toString();
        
        toast({
          title: "Refresh Started",
          description: refreshResponse.message
        });
        
        // Poll for new keyword details
        let pollAttempts = 0;
        const maxAttempts = 60; // 5 minutes max
        
        const pollForNewData = async () => {
          try {
            const detailsResponse = await getKeywordDetails(listingId, newKeywordId);
            if (detailsResponse.code === 200) {
              // First, refresh keywords list to include new keyword
              await onKeywordsUpdate(newKeywordId);
              
              // Then set keyword details
              onKeywordDetailsUpdate(detailsResponse.data);
              
              // Set the most recent date as default
              if (detailsResponse.data.dates && detailsResponse.data.dates.length > 0) {
                const sortedDates = detailsResponse.data.dates
                  .filter(d => d.date)
                  .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
                
                if (sortedDates.length > 0) {
                  onDateUpdate(sortedDates[0].id);
                }
              }
              
              toast({
                title: "Refresh Complete",
                description: "Keyword data has been refreshed successfully"
              });
              
              setRefreshing(false);
              return;
            }
          } catch (error) {
            console.error('Error polling for new keyword data:', error);
          }
          
          pollAttempts++;
          if (pollAttempts < maxAttempts) {
            setTimeout(pollForNewData, 5000); // Poll every 5 seconds
          } else {
            setRefreshError('Refresh timeout - please try again');
            setRefreshing(false);
            toast({
              title: "Refresh Timeout",
              description: "The refresh is taking longer than expected. Please try again.",
              variant: "destructive"
            });
          }
        };
        
        // Start polling
        setTimeout(pollForNewData, 2000); // Wait 2 seconds before first poll
        
      } else {
        throw new Error(refreshResponse.message || 'Failed to refresh keyword');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh keyword';
      setRefreshError(errorMessage);
      setRefreshing(false);
      toast({
        title: "Refresh Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return {
    refreshing,
    refreshError,
    handleRefreshKeyword
  };
};