import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { MapPin, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import L from 'leaflet';

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

interface GridPoint {
  lat: number;
  lng: number;
  ranking: number | null;
  id: string;
}

interface GeoRankingMapProps {
  mapPoint: string;
  loadingGrid: boolean;
  defaultCoordinates: { lat: number; lng: number } | null;
  gridCoordinates: string[];
  currentMarkers: L.Marker[];
  setCurrentMarkers: React.Dispatch<React.SetStateAction<L.Marker[]>>;
  mapInstanceRef: React.MutableRefObject<L.Map | null>;
  distanceValue: string;
  distanceUnit: string;
}

export const GeoRankingMap: React.FC<GeoRankingMapProps> = ({
  mapPoint,
  loadingGrid,
  defaultCoordinates,
  gridCoordinates,
  currentMarkers,
  setCurrentMarkers,
  mapInstanceRef,
  distanceValue,
  distanceUnit
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // Calculate appropriate zoom level based on distance
  const calculateZoomLevel = (): number => {
    if (!distanceValue) return 14;
    
    const distance = parseFloat(distanceValue.replace('mi', ''));
    
    if (distanceUnit === 'Miles') {
      if (distance <= 0.25) return 17;
      if (distance <= 0.5) return 16;
      if (distance <= 1) return 15;
      if (distance <= 2) return 14;
      if (distance <= 5) return 13;
      if (distance <= 10) return 12;
      return 11;
    } else {
      // Meters/KM
      if (distance <= 100) return 17;
      if (distance <= 200) return 16;
      if (distance <= 500) return 15;
      if (distance <= 1) return 14; // 1 KM
      if (distance <= 2.5) return 13;
      if (distance <= 5) return 12;
      if (distance <= 10) return 11;
      return 10;
    }
  };

  // Calculate optimal view for all coordinates
  const calculateOptimalView = () => {
    if (!mapInstanceRef.current || !defaultCoordinates) return;

    let allCoordinates: [number, number][] = [];
    
    // Always include default coordinates
    allCoordinates.push([defaultCoordinates.lat, defaultCoordinates.lng]);
    
    // Add grid coordinates if in automatic mode
    if (mapPoint === 'Automatic' && gridCoordinates.length > 0) {
      gridCoordinates.forEach(coord => {
        const [lat, lng] = coord.split(',').map(Number);
        allCoordinates.push([lat, lng]);
      });
    }

    if (allCoordinates.length > 1) {
      // Use fitBounds for multiple coordinates
      const bounds = L.latLngBounds(allCoordinates);
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [30, 30],
        maxZoom: calculateZoomLevel()
      });
    } else {
      // Single coordinate - use distance-based zoom
      const zoom = calculateZoomLevel();
      mapInstanceRef.current.setView([defaultCoordinates.lat, defaultCoordinates.lng], zoom);
    }
  };

  // Zoom control functions
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  // Generate grid overlay data from API coordinates
  const generateGridDataFromAPI = (): GridPoint[] => {
    return gridCoordinates.map((coord, index) => {
      const [lat, lng] = coord.split(',').map(Number);
      return {
        lat,
        lng,
        ranking: null,
        id: index.toString()
      };
    });
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
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      className: 'default-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
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

  // Add automatic grid markers while preserving default marker
  const addAutomaticMarkers = (): void => {
    if (!mapInstanceRef.current || !defaultCoordinates) return;

    // Clear only grid markers, preserve default marker
    const gridMarkers = currentMarkers.filter(marker => 
      (marker.options as any).className !== 'default-marker'
    );
    gridMarkers.forEach(marker => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    
    // Keep default marker in the list
    const defaultMarker = currentMarkers.find(marker => 
      (marker.options as any).className === 'default-marker'
    );
    
    const gridData = gridCoordinates.length > 0 ? generateGridDataFromAPI() : [];
    const markers: L.Marker[] = defaultMarker ? [defaultMarker] : [];
    
    // Add default marker if it doesn't exist
    if (!defaultMarker) {
      const defaultIcon = L.divIcon({
        html: `<div style="
          background: #dc2626;
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
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        className: 'default-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const defaultMarkerInstance = L.marker([defaultCoordinates.lat, defaultCoordinates.lng], {
        icon: defaultIcon
      }).addTo(mapInstanceRef.current);

      defaultMarkerInstance.bindPopup(`
        <div style="text-align: center; padding: 5px;">
          <strong>Default Location</strong><br>
          <small>Business center point</small>
        </div>
      `);

      markers.push(defaultMarkerInstance);
    }
    
    // Add grid markers with red color as fallback
    gridData.forEach(point => {
      const rankingIcon = L.divIcon({
        html: `<div style="
          background: ${point.ranking === 1 ? '#22c55e' : point.ranking && point.ranking <= 3 ? '#f59e0b' : point.ranking && point.ranking <= 6 ? '#ef4444' : '#dc2626'};
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
        "> ${ point.ranking !== null ? point.ranking : '' } </div>`,
        className: 'custom-ranking-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([point.lat, point.lng], {
        icon: rankingIcon
      }).addTo(mapInstanceRef.current!);
      
      marker.bindPopup(`Grid Point: ${point.id}`);
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

    const initialZoom = calculateZoomLevel();
    const map = L.map(mapRef.current).setView([defaultCoordinates.lat, defaultCoordinates.lng], initialZoom);
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

    if (mapPoint === 'Automatic') {
      addAutomaticMarkers();
      // Auto-adjust view after markers are added
      setTimeout(() => calculateOptimalView(), 100);
    } else {
      // For manual mode, show default marker initially
      addDefaultMarker();
      enableManualSelection();
      // Use distance-based zoom for manual mode
      setTimeout(() => calculateOptimalView(), 100);
    }
  }, [mapPoint, gridCoordinates]);

  // Handle distance changes to adjust zoom automatically
  useEffect(() => {
    if (mapInstanceRef.current && defaultCoordinates) {
      calculateOptimalView();
    }
  }, [distanceValue, distanceUnit]);

  return (
    <Card className="overflow-hidden h-[400px] sm:h-[500px] lg:h-[680px]">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle className="text-base lg:text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
          {mapPoint === 'Manually' ? 'Manual Point Selection' : 'Automatic Grid Visualization'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full relative">
        {loadingGrid && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="text-center bg-white p-6 rounded-lg shadow-lg border">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">Loading Map Data</p>
              <p className="text-xs text-gray-500">
                {mapPoint === 'Automatic' ? 'Generating grid coordinates...' : 'Preparing map...'}
              </p>
            </div>
          </div>
        )}
        
        {/* Zoom Controls */}
        <div className="absolute top-20 right-4 z-20 flex flex-col gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleZoomIn}
            className="w-10 h-10 p-0 bg-white/90 hover:bg-white border shadow-lg"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleZoomOut}
            className="w-10 h-10 p-0 bg-white/90 hover:bg-white border shadow-lg"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>
        
        <div ref={mapRef} className="w-full h-[330px] sm:h-[430px] lg:h-[600px]" />
      </CardContent>
    </Card>
  );
};