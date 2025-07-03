import { useState, useEffect } from 'react';
import { getDefaultCoordinates, getGridCoordinates, addKeywords, getKeywordDetailsWithStatus, CheckRankRequest, KeywordDetailsData, RankDetail } from '../api/geoRankingApi';
import { useToast } from './use-toast';
import { processDistanceValue } from '../utils/geoRankingUtils';
import L from 'leaflet';

interface FormData {
  searchBusinessType: string;
  searchBusiness: string;
  searchDataEngine: string;
  keywords: string;
  mapPoint: string;
  distanceUnit: string;
  distanceValue: string;
  gridSize: string;
  scheduleCheck: string;
  language: string;
}

export const useGeoRankingReport = (listingId: number) => {
  const { toast } = useToast();
  const [defaultCoordinates, setDefaultCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [gridCoordinates, setGridCoordinates] = useState<string[]>([]);
  const [loadingGrid, setLoadingGrid] = useState(false);
  const [currentMarkers, setCurrentMarkers] = useState<L.Marker[]>([]);
  const [submittingRank, setSubmittingRank] = useState(false);
  const [pollingKeyword, setPollingKeyword] = useState(false);
  const [keywordData, setKeywordData] = useState<KeywordDetailsData | null>(null);
  const [currentKeywordId, setCurrentKeywordId] = useState<string | null>(null);
  const [pollingProgress, setPollingProgress] = useState(0);

  const [formData, setFormData] = useState<FormData>({
    searchBusinessType: 'name',
    searchBusiness: '',
    searchDataEngine: 'Briefcase API',
    keywords: '',
    mapPoint: 'Automatic',
    distanceUnit: 'Meters',
    distanceValue: '100',
    gridSize: '3',
    scheduleCheck: 'onetime',
    language: 'en'
  });

  // Initialize form from URL params if cloning
  const initializeFromCloneData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isClone = urlParams.get('clone') === 'true';
    
    if (isClone) {
      const keyword = urlParams.get('keyword');
      if (keyword) {
        setFormData(prev => ({
          ...prev,
          keywords: keyword
        }));
      }
    }
  };

  // Initialize from clone data on component mount
  useEffect(() => {
    initializeFromCloneData();
  }, []);

  // Fetch default coordinates on component mount
  useEffect(() => {
    const fetchDefaultCoordinates = async () => {
      try {
        const response = await getDefaultCoordinates(listingId);
        if (response.code === 200) {
          const [lat, lng] = response.data.latlong.split(',').map(Number);
          setDefaultCoordinates({ lat, lng });
        }
      } catch (error) {
        console.error('Error fetching default coordinates:', error);
        toast({
          title: "Error",
          description: "Failed to fetch default coordinates",
          variant: "destructive"
        });
        // Use fallback coordinates (Delhi)
        setDefaultCoordinates({ lat: 28.6139, lng: 77.2090 });
      }
    };

    fetchDefaultCoordinates();
  }, [listingId, toast]);

  // Fetch grid coordinates from API
  const fetchGridCoordinates = async () => {
    if (!defaultCoordinates) return;
    
    setLoadingGrid(true);
    try {
      const gridSize = parseInt(formData.gridSize.split('x')[0]);
      // For Miles with 'mi' suffix, send raw string; otherwise process as number
      const processedDistance = processDistanceValue(formData.distanceValue, formData.distanceUnit);
      const distance = typeof processedDistance === 'string' ? processedDistance : processedDistance;
      const latlong = `${defaultCoordinates.lat},${defaultCoordinates.lng}`;
      
      console.log('Sending to API:', { gridSize, distance, distanceUnit: formData.distanceUnit, distanceValue: formData.distanceValue, processedDistance });
      
      const response = await getGridCoordinates(listingId, gridSize, distance, latlong);
      if (response.code === 200) {
        setGridCoordinates(response.data.allCoordinates);
      }
    } catch (error) {
      console.error('Error fetching grid coordinates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch grid coordinates",
        variant: "destructive"
      });
    } finally {
      setLoadingGrid(false);
    }
  };

  // Fetch grid coordinates when relevant parameters change
  useEffect(() => {
    if (formData.mapPoint === 'Automatic' && defaultCoordinates) {
      fetchGridCoordinates();
    }
  }, [formData.gridSize, formData.distanceValue, defaultCoordinates, formData.mapPoint]);

  // Reset distance value when unit changes
  useEffect(() => {
    const defaultValue = formData.distanceUnit === 'Meters' ? '100' : '.1';
    setFormData(prev => ({
      ...prev,
      distanceValue: defaultValue
    }));
  }, [formData.distanceUnit]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to detect multiple keywords
  const isMultipleKeywords = (keywords: string): boolean => {
    const keywordArray = keywords
      .split(/[,;\n\r]+/)
      .map(k => k.trim())
      .filter(k => k.length > 0);
    return keywordArray.length > 1;
  };

  // Polling function to check keyword details every 5 seconds
  const pollKeywordDetails = async (
    keywordId: string,
    maxAttempts: number = 60 // 5 minutes maximum
  ): Promise<boolean> => {
    setPollingKeyword(true);
    setPollingProgress(0);
    
    try {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(`Polling attempt ${attempt}/${maxAttempts} for keywordId: ${keywordId}`);
        
        // Update progress every 5 seconds
        const progress = Math.min((attempt / maxAttempts) * 100, 95);
        setPollingProgress(progress);
        
        const response = await getKeywordDetailsWithStatus(listingId, keywordId, 1);
        
        // Check if data is populated (not empty array)
        if (Array.isArray(response.data) && response.data.length === 0) {
          // Still in queue, wait 5 seconds before next attempt
          if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            continue;
          }
        } else {
          // Data is ready
          console.log('Keyword details ready:', response);
          setPollingProgress(100);
          setKeywordData(response.data as KeywordDetailsData);
          toast({
            title: "Keyword Processed",
            description: "Your keyword ranking data is now available!",
          });
          return true;
        }
      }
      
      // Max attempts reached
      throw new Error('Polling timeout: Keyword processing took too long');
    } catch (error) {
      console.error('Polling error:', error);
      toast({
        title: "Processing Timeout",
        description: "Keyword processing is taking longer than expected. Please check back later.",
        variant: "destructive"
      });
      return false;
    } finally {
      setPollingKeyword(false);
      setPollingProgress(0);
    }
  };

  // Submit check rank request
  const submitCheckRank = async (): Promise<{ success: boolean; shouldNavigate: boolean }> => {
    if (!formData.keywords.trim()) {
      toast({
        title: "Error",
        description: "Keywords are required",
        variant: "destructive"
      });
      return { success: false, shouldNavigate: false };
    }

    setSubmittingRank(true);
    try {
      // Prepare coordinates array
      let coordinatesArray: string[] = [];
      
      if (formData.mapPoint === 'Automatic') {
        // Include default coordinate first, then grid coordinates
        const defaultCoord = defaultCoordinates ? `${defaultCoordinates.lat},${defaultCoordinates.lng}` : null;
        coordinatesArray = defaultCoord ? [defaultCoord, ...gridCoordinates] : gridCoordinates;
      } else {
        // Manual mode - extract coordinates from markers
        coordinatesArray = currentMarkers.map(marker => {
          const { lat, lng } = marker.getLatLng();
          return `${lat},${lng}`;
        });
      }

      if (coordinatesArray.length === 0) {
        toast({
          title: "Error",
          description: "No coordinates available. Please generate grid or place markers.",
          variant: "destructive"
        });
        return { success: false, shouldNavigate: false };
      }

      // Transform form data to API format
      const processedDistance = processDistanceValue(formData.distanceValue, formData.distanceUnit);
      const requestData: CheckRankRequest = {
        listingId,
        language: formData.language,
        keywords: formData.keywords,
        mapPoint: formData.mapPoint,
        distanceValue: typeof processedDistance === 'number' ? processedDistance : parseFloat(processedDistance.replace(/[^0-9.]/g, '')),
        gridSize: parseInt(formData.gridSize.split('x')[0]),
        searchDataEngine: formData.searchDataEngine,
        scheduleCheck: formData.scheduleCheck.toLowerCase().replace('-', ''),
        latlng: coordinatesArray
      };

      console.log('Check rank request data:', requestData);
      
      const response = await addKeywords(requestData);
      const multipleKeywords = isMultipleKeywords(formData.keywords);
      
      if (response.code === 200) {
        // If we got a keywordId, start polling for keyword details
        if (response.data?.keywordId) {
          setCurrentKeywordId(response.data.keywordId.toString());
          toast({
            title: "Processing Keyword",
            description: "Please wait while we process your keyword ranking data...",
            variant: "default"
          });
          
          // Start polling in background - don't wait for it to complete
          pollKeywordDetails(response.data.keywordId.toString()).catch(error => {
            console.error('Polling failed:', error);
          });
        } else {
          // No keywordId received, keyword is in queue
          toast({
            title: "Keyword in Queue",
            description: "Your keyword is in queue. It will take some time to process.",
            variant: "default"
          });
        }

        toast({
          title: "Success",
          description: "Rank check submitted successfully",
        });
        
        return { success: true, shouldNavigate: multipleKeywords };
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to submit rank check",
          variant: "destructive"
        });
        return { success: false, shouldNavigate: false };
      }
    } catch (error) {
      console.error('Error submitting rank check:', error);
      toast({
        title: "Error",
        description: "Failed to submit rank check",
        variant: "destructive"
      });
      return { success: false, shouldNavigate: false };
    } finally {
      setSubmittingRank(false);
    }
  };

  return {
    formData,
    defaultCoordinates,
    gridCoordinates,
    loadingGrid,
    currentMarkers,
    setCurrentMarkers,
    submittingRank,
    pollingKeyword,
    pollingProgress,
    keywordData,
    currentKeywordId,
    handleInputChange,
    fetchGridCoordinates,
    submitCheckRank
  };
};
