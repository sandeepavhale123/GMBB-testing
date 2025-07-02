import { useState, useEffect } from 'react';
import { getDefaultCoordinates, getGridCoordinates } from '../api/geoRankingApi';
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

  const [formData, setFormData] = useState<FormData>({
    searchBusinessType: 'name',
    searchBusiness: '',
    searchDataEngine: 'Map API',
    keywords: '',
    mapPoint: 'Automatic',
    distanceUnit: 'Meters',
    distanceValue: '100',
    gridSize: '5x5',
    scheduleCheck: 'One-time',
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
      const distance = processDistanceValue(formData.distanceValue, formData.distanceUnit);
      const latlong = `${defaultCoordinates.lat},${defaultCoordinates.lng}`;
      
      console.log('Sending to API:', { gridSize, distance, distanceUnit: formData.distanceUnit, distanceValue: formData.distanceValue });
      
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

  return {
    formData,
    defaultCoordinates,
    gridCoordinates,
    loadingGrid,
    currentMarkers,
    setCurrentMarkers,
    handleInputChange,
    fetchGridCoordinates
  };
};