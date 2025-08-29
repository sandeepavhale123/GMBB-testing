import { useState } from 'react';
import { getKeywordDetailsForProject, refreshKeywordForProject } from '../api/geoRankingApi';
import { useToast } from './use-toast';

interface UseProjectKeywordRefreshProps {
  projectId: number;
  selectedKeyword: string;
  onKeywordsUpdate: (selectKeywordId?: string) => Promise<void>;
  fetchKeywordDetailsManually?: (keywordId: string) => Promise<void>;
  onDateSelect?: (dateId: string) => void;
}

export const useProjectKeywordRefresh = ({
  projectId,
  selectedKeyword,
  onKeywordsUpdate,
  fetchKeywordDetailsManually,
  onDateSelect
}: UseProjectKeywordRefreshProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [isPollingActive, setIsPollingActive] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(0);
  const { toast } = useToast();

  const handleRefreshKeyword = async () => {
    if (!projectId || !selectedKeyword) return;
    
    setRefreshing(true);
    setRefreshError(null);
    setRefreshProgress(0);
    setIsPollingActive(true);
    
    try {
      const refreshResponse = await refreshKeywordForProject(projectId, selectedKeyword);
      
      if (refreshResponse.code === 200) {
        const newKeywordId = refreshResponse.data.keywordId.toString();
        
        toast({
          title: "Refresh Started",
          description: refreshResponse.message
        });
        
        let pollAttempts = 0;
        const maxAttempts = 60;
        
        const pollForNewData = async () => {
          try {
            const currentProgress = Math.min(Math.floor((pollAttempts / maxAttempts) * 95), 95);
            setRefreshProgress(currentProgress);
            
            const detailsResponse = await getKeywordDetailsForProject(projectId, newKeywordId);
            if (detailsResponse.code === 200) {
              setIsPollingActive(false);
              setRefreshProgress(100);
              
              await onKeywordsUpdate(newKeywordId);
              
              if (fetchKeywordDetailsManually) {
                await fetchKeywordDetailsManually(newKeywordId);
              }

              if (onDateSelect && detailsResponse.data.dates && detailsResponse.data.dates.length > 0) {
                const sortedDates = detailsResponse.data.dates
                  .filter(d => d.date)
                  .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
                
                if (sortedDates.length > 0) {
                  console.log('🗺️ Auto-selecting latest date after refresh:', sortedDates[0]);
                  onDateSelect(sortedDates[0].id);
                }
              }
              
              toast({
                title: "Refresh Complete",
                description: "Keyword data has been refreshed successfully"
              });
              
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
            setTimeout(pollForNewData, 5000);
          } else {
            setIsPollingActive(false);
            setRefreshProgress(0);
            setRefreshError('Refresh timeout - please try again');
            setRefreshing(false);
            toast({
              title: "Refresh Timeout",
              description: "The refresh is taking longer than expected. Please try again.",
              variant: "destructive"
            });
          }
        };
        
        setTimeout(pollForNewData, 2000);
        
      } else {
        throw new Error(refreshResponse.message || 'Failed to refresh keyword');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh keyword';
      setRefreshError(errorMessage);
      setRefreshing(false);
      setIsPollingActive(false);
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
    refreshPollingActive: isPollingActive,
    handleRefreshKeyword
  };
};