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
  const [isPollingActive, setIsPollingActive] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(0);
  const { toast } = useToast();

  const handleRefreshKeyword = async () => {
    if (!listingId || !selectedKeyword) return;
    
    setRefreshing(true);
    setRefreshError(null);
    setRefreshProgress(0); // Reset progress
    setIsPollingActive(true); // Start polling when refresh begins
    
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
        
        // Poll for new keyword details with timeout
        let pollAttempts = 0;
        const maxAttempts = 60; // 5 minutes max
        
        const pollForNewData = async () => {
          try {
            // Update progress based on polling attempts (0-95% during polling, 100% on success)
            const currentProgress = Math.min(Math.floor((pollAttempts / maxAttempts) * 95), 95);
            setRefreshProgress(currentProgress);
            
            const detailsResponse = await getKeywordDetails(listingId, newKeywordId);
            if (detailsResponse.code === 200) {
              // Stop polling first
              setIsPollingActive(false);
              setRefreshProgress(100); // Complete progress
              
              // Batch all state updates to prevent UI flashing
              await Promise.all([
                // First, refresh keywords list to include new keyword
                onKeywordsUpdate(newKeywordId),
                // Delay to ensure state is properly set
                new Promise(resolve => setTimeout(resolve, 100))
              ]);
              
              // Then set keyword details and date atomically
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
              
              // Reset progress after a brief delay
              setTimeout(() => {
                setRefreshProgress(0);
                setRefreshing(false);
              }, 1000);
              return;
            }
          } catch (error) {
            console.error('Error polling for new keyword data:', error);
          }
          
          pollAttempts++;
          if (pollAttempts < maxAttempts) {
            setTimeout(pollForNewData, 5000); // Poll every 5 seconds
          } else {
            setIsPollingActive(false); // Stop polling on timeout
            setRefreshProgress(0); // Reset progress on timeout
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
      setIsPollingActive(false); // Stop polling on error
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
    refreshProgress,
    isPollingActive,
    handleRefreshKeyword
  };
};