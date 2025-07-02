import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Info, MapPin } from 'lucide-react';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { getDefaultCoordinates } from '../../api/geoRankingApi';
import { useToast } from '../../hooks/use-toast';
import { useBusinessListings } from '../../hooks/useBusinessListings';

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

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

interface GridPoint {
  lat: number;
  lng: number;
  ranking: number || number;
  id: string;
}

export const GeoRankingReportPage: React.FC = () => {
  const navigate = useNavigate();
  const { listingId } = useParams();
  const numericListingId = listingId ? parseInt(listingId, 10) : 160886;
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentMarkers, setCurrentMarkers] = useState<L.Marker[]>([]);
  const [defaultCoordinates, setDefaultCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();
  const { listings } = useBusinessListings();

  // Get current listing - convert numericListingId to string for comparison
  const currentListing = listings.find(listing => listing.id === numericListingId.toString());

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

  // Distance options based on unit
  const getDistanceOptions = () => {
    if (formData.distanceUnit === 'Meters') {
      return [
        { value: '100', label: '100 m' },
        { value: '200', label: '200 m' },
        { value: '500', label: '500 m' },
        { value: '1', label: '1 KM' },
        { value: '2.5', label: '2.5 KM' },
        { value: '5', label: '5 KM' },
        { value: '10', label: '10 KM' },
        { value: '25', label: '25 KM' }
      ];
    } else {
      return [
        { value: '.1', label: '.1 mi' },
        { value: '.25', label: '.25 mi' },
        { value: '.5', label: '.5 mi' },
        { value: '.75', label: '.75 mi' },
        { value: '1', label: '1 mi' },
        { value: '2', label: '2 mi' },
        { value: '3', label: '3 mi' },
        { value: '5', label: '5 mi' },
        { value: '8', label: '8 mi' },
        { value: '10', label: '10 mi' }
      ];
    }
  };

  // Language options
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'zh', label: 'Chinese' }
  ];

  // Fetch default coordinates on component mount
  useEffect(() => {
    const fetchDefaultCoordinates = async () => {
      try {
        const response = await getDefaultCoordinates(numericListingId);
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
  }, [numericListingId, toast]);

  // Generate grid overlay data for automatic mode
  const generateGridData = (gridSize: string): GridPoint[] => {
    const [rows, cols] = gridSize.split('x').map(Number);
    const gridData: GridPoint[] = [];
    const centerLat = defaultCoordinates?.lat || 28.6139;
    const centerLng = defaultCoordinates?.lng || 77.2090;
    const spacing = 0.003;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const lat = centerLat + (i - Math.floor(rows / 2)) * spacing;
        const lng = centerLng + (j - Math.floor(cols / 2)) * spacing;
        // const ranking = Math.floor(Math.random() * 8) + 1;
        const ranking = null;
        gridData.push({
          lat,
          lng,
          ranking,
          id: `${i}-${j}`
        });
      }
    }
    return gridData;
  };

  // Clear all markers from map
  const clearAllMarkers = (): void => {
    currentMarkers.forEach(marker => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    setCurrentMarkers([]);
  };

  // Add default red marker
  const addDefaultMarker = (): void => {
    if (!mapInstanceRef.current || !defaultCoordinates) return;

    const defaultIcon = L.divIcon({
      html: `<div style="
        background: #dc2626;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 12px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      className: 'default-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker([defaultCoordinates.lat, defaultCoordinates.lng], {
      icon: defaultIcon
    }).addTo(mapInstanceRef.current);

    marker.bindPopup(`
      <div style="text-align: center; padding: 5px;">
        <strong>Default Location</strong><br>
        <small>Switch to manual to place custom points</small>
      </div>
    `);

    setCurrentMarkers([marker]);
  };

  // Add automatic grid markers
  const addAutomaticMarkers = (): void => {
    if (!mapInstanceRef.current || !defaultCoordinates) return;

    clearAllMarkers();
    
    const gridData = generateGridData(formData.gridSize);
    const markers: L.Marker[] = [];
    
    gridData.forEach(point => {
      const rankingIcon = L.divIcon({
        html: `<div style="
          background: ${point.ranking === 1 ? '#22c55e' : point.ranking <= 3 ? '#f59e0b' : point.ranking <= 6 ? '#ef4444' : '#ef4444'};
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        "> ${ point.ranking !== 'null' ? point.ranking : '' } </div>`,
        className: 'custom-ranking-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([point.lat, point.lng], {
        icon: rankingIcon
      }).addTo(mapInstanceRef.current!);
      
      marker.bindPopup(`Ranking: ${point.ranking}`);
      markers.push(marker);
    });
    
    setCurrentMarkers(markers);
  };

  // Enable manual point selection
  const enableManualSelection = (): void => {
    if (!mapInstanceRef.current || !defaultCoordinates) return;

    clearAllMarkers();

    // Add click event for manual marker placement
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!mapInstanceRef.current) return;

      const manualIcon = L.divIcon({
        html: `<div style="
          background: #dc2626;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        ">●</div>`,
        className: 'manual-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker(e.latlng, {
        icon: manualIcon,
        draggable: true
      }).addTo(mapInstanceRef.current!);

      marker.bindPopup(`
        <div style="text-align: center; padding: 5px;">
          <strong>Manual Point</strong><br>
          <small>Drag to reposition</small><br>
          <button onclick="this.closest('.leaflet-popup').querySelector('.leaflet-popup-close-button').click(); 
            window.removeManualMarker && window.removeManualMarker('${L.stamp(marker)}')" 
            style="background: #dc2626; color: white; border: none; padding: 4px 8px; border-radius: 4px; margin-top: 5px; cursor: pointer;">
            Remove
          </button>
        </div>
      `);

      setCurrentMarkers(prev => [...prev, marker]);
    };

    mapInstanceRef.current.on('click', handleMapClick);

    // Add global function to remove markers
    (window as any).removeManualMarker = (markerId: string) => {
      const marker = currentMarkers.find(m => L.stamp(m).toString() === markerId);
      if (marker && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
        setCurrentMarkers(prev => prev.filter(m => m !== marker));
      }
    };
  };

  useEffect(() => {
    // Load Leaflet CSS dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    if (!mapRef.current || !defaultCoordinates) return;

    const map = L.map(mapRef.current).setView([defaultCoordinates.lat, defaultCoordinates.lng], 14);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Show default red marker initially
    addDefaultMarker();

    return () => {
      if (map) {
        map.remove();
      }
      const existingLink = document.querySelector('link[href*="leaflet.css"]');
      if (existingLink) {
        existingLink.remove();
      }
      // Clean up global function
      delete (window as any).removeManualMarker;
    };
  }, [defaultCoordinates]);

  // Handle map point mode change
  useEffect(() => {
    if (!mapInstanceRef.current || !defaultCoordinates) return;

    // Remove existing click handlers
    mapInstanceRef.current.off('click');

    if (formData.mapPoint === 'Automatic') {
      addAutomaticMarkers();
    } else {
      // For manual mode, show default marker initially
      addDefaultMarker();
      enableManualSelection();
    }
  }, [formData.mapPoint, formData.gridSize, defaultCoordinates]);

  // Reset distance value when unit changes
  useEffect(() => {
    const defaultValue = formData.distanceUnit === 'Meters' ? '100' : '.1';
    setFormData(prev => ({
      ...prev,
      distanceValue: defaultValue
    }));
  }, [formData.distanceUnit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Checking GEO ranking with data:', formData);
    navigate('/');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar 
        activeTab="geo-ranking" 
        onTabChange={() => {}} 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={toggleSidebar} 
      />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header onToggleSidebar={toggleSidebar} />
        
        <div className="p-3 sm:p-4 lg:p-6 px-0 py-0">
          <div className="max-w-7xl mx-auto">
            {/* Listing Header */}
            {currentListing && (
              <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{currentListing.name}</h2>
                    <p className="text-sm text-gray-600">{currentListing.address}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
              {/* Report Configuration */}
              <div className="xl:col-span-4 order-1 xl:order-2">
                <Card className="shadow-lg h-[400px] sm:h-[500px] lg:h-[680px]">
                  <CardHeader className="pb-3 lg:pb-4">
                    <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">
                      Report Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 lg:space-y-6 overflow-y-auto h-full pb-6">
                    <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                      {/* Keywords */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="keywords" className="text-sm font-medium text-gray-700">
                            Keywords
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Add up to 5 keywords separated by commas</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input 
                          id="keywords" 
                          placeholder="keyword1, keyword2, keyword3" 
                          value={formData.keywords} 
                          onChange={(e) => handleInputChange('keywords', e.target.value)} 
                          className="w-full" 
                        />
                      </div>

                      {/* Search Data Engine */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                          Search Data Engine
                        </Label>
                        <RadioGroup 
                          value={formData.searchDataEngine} 
                          onValueChange={(value) => handleInputChange('searchDataEngine', value)} 
                          className="flex flex-row gap-4 sm:gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Map API" id="map-api" />
                            <Label htmlFor="map-api" className="text-sm">Map API</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Briefcase API" id="briefcase-api" />
                            <Label htmlFor="briefcase-api" className="text-sm">Briefcase API</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Map Point */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Map Point
                        </Label>
                        <Select 
                          value={formData.mapPoint} 
                          onValueChange={(value) => handleInputChange('mapPoint', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Manually">Manually</SelectItem>
                          </SelectContent>
                        </Select>
                        {formData.mapPoint === 'Manually' && (
                          <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                            Click on the map to place points manually. You can drag them to reposition.
                          </p>
                        )}
                      </div>

                      {/* Distance Unit and Distance Value */}
                      <div className=" grid lg:grid-cols-2">
                        <div className="space-y-2 span-col-1 ">
                          <Label className="text-sm font-medium text-gray-700">
                          Distance Unit
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                          <RadioGroup 
                            value={formData.distanceUnit} 
                            onValueChange={(value) => handleInputChange('distanceUnit', value)} 
                            className="flex flex-col gap-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Meters" id="meters" />
                              <Label htmlFor="meters" className="text-sm">Meters</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Miles" id="miles" />
                              <Label htmlFor="miles" className="text-sm">Miles</Label>
                            </div>
                          </RadioGroup>
                          
                        </div>
                        </div>
                        <div className="space-y-2 span-col-1 ">
                            <Label className="text-sm font-medium text-gray-700">
                              Distance
                            </Label>
                            <Select 
                              value={formData.distanceValue} 
                              onValueChange={(value) => handleInputChange('distanceValue', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {getDistanceOptions().map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                      </div>

                      {/* Grid Size and Schedule Check */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Grid Size
                          </Label>
                          <Select 
                            value={formData.gridSize} 
                            onValueChange={(value) => handleInputChange('gridSize', value)}
                            disabled={formData.mapPoint === 'Manually'}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3x3">3x3</SelectItem>
                              <SelectItem value="5x5">5x5</SelectItem>
                              <SelectItem value="7x7">7x7</SelectItem>
                              <SelectItem value="9x9">9x9</SelectItem>
                              <SelectItem value="11x11">11x11</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Schedule Check
                          </Label>
                          <Select 
                            value={formData.scheduleCheck} 
                            onValueChange={(value) => handleInputChange('scheduleCheck', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="One-time">One-time</SelectItem>
                              <SelectItem value="Weekly">Weekly</SelectItem>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Language Selector */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Language
                        </Label>
                        <Select 
                          value={formData.language} 
                          onValueChange={(value) => handleInputChange('language', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {languageOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6">
                        Check rank
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Map Section */}
              <div className="xl:col-span-8 order-2 xl:order-1">
                <Card className="overflow-hidden h-[400px] sm:h-[500px] lg:h-[680px]">
                  <CardHeader className="pb-3 lg:pb-4">
                    <CardTitle className="text-base lg:text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
                      {formData.mapPoint === 'Manually' ? 'Manual Point Selection' : 'Automatic Grid Visualization'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-full">
                    <div ref={mapRef} className="w-full h-[330px] sm:h-[430px] lg:h-[600px]" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
