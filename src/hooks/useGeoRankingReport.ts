
import { useState, useEffect } from 'react';
import { getDefaultCoordinates, getGridCoordinates, addKeywords, getKeywordDetailsWithStatus, CheckRankRequest } from '../api/geoRankingApi';
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

  const [formData, setFormData] = useState<FormData>({
    searchBusinessType: 'name',
    searchBusiness: '',
    searchDataEngine: 'Briefcase API',
    keywords: '',
    mapPoint: 'Automatic',
    distanceUnit: 'Meters',
    distanceValue: '100',
    gridSize: '5',
    scheduleCheck: 'onetime',
    language: 'en'
  });

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
      const distance = formData.distanceUnit === 'Miles' && formData.distanceValue.includes('mi') 
        ? formData.distanceValue 
        : processDistanceValue(formData.distanceValue, formData.distanceUnit);
      const latlong = `${defaultCoordinates.lat},${defaultCoordinates.lng}`;
      
      console.log('Sending to API:', { gridSize, distance, distanceUnit: formData.distanceUnit, distanceValue: formData.distanceValue, processedDistance: distance });
      
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
        coordinatesArray = gridCoordinates;
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
      const requestData: CheckRankRequest = {
        listingId,
        language: formData.language,
        keywords: formData.keywords,
        mapPoint: formData.mapPoint,
        distanceValue: processDistanceValue(formData.distanceValue, formData.distanceUnit),
        gridSize: parseInt(formData.gridSize.split('x')[0]),
        searchDataEngine: formData.searchDataEngine,
        scheduleCheck: formData.scheduleCheck.toLowerCase().replace('-', ''),
        latlng: coordinatesArray
      };

      console.log('Check rank request data:', requestData);
      
      const response = await addKeywords(requestData);
      const multipleKeywords = isMultipleKeywords(formData.keywords);
      
      if (response.code === 200) {
        // If we got a keywordId, fetch keyword details with status: 1
        if (response.data?.keywordId) {
          try {
            await getKeywordDetailsWithStatus(listingId, response.data.keywordId.toString(), 1);
            console.log('Keyword details fetched successfully');
          } catch (error) {
            console.error('Error fetching keyword details:', error);
          }
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
    handleInputChange,
    fetchGridCoordinates,
    submitCheckRank
  };
};
