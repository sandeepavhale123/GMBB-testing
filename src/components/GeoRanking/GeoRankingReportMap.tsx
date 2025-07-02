import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { MapPin, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import L from 'leaflet';
import { RankDetail } from '../../api/geoRankingApi';

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

interface GeoRankingReportMapProps {
  defaultCoordinates: { lat: number; lng: number } | null;
  gridCoordinates: string[];
  rankDetails: RankDetail[] | null;
  pollingKeyword: boolean;
  loadingGrid: boolean;
  onMarkerClick: (coordinate: string, positionId: string) => void;
}

export const GeoRankingReportMap: React.FC<GeoRankingReportMapProps> = ({
  defaultCoordinates,
  gridCoordinates,
  rankDetails,
  pollingKeyword,
  loadingGrid,
  onMarkerClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Get rank color based on ranking
  const getRankColor = (rank: string): string => {
    const rankNum = rank === '20+' ? 21 : parseInt(rank);
    if (rankNum <= 3) return '#22c55e'; // Green
    if (rankNum <= 10) return '#f59e0b'; // Yellow
    if (rankNum <= 15) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  // Clear all markers
  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];
  };

  // Add default business marker
  const addDefaultMarker = () => {
    if (!mapInstanceRef.current || !defaultCoordinates) return;

    const defaultIcon = L.divIcon({
      html: `<div style="
        background: #3b82f6;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">📍</div>`,
      className: 'default-business-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const marker = L.marker([defaultCoordinates.lat, defaultCoordinates.lng], {
      icon: defaultIcon
    }).addTo(mapInstanceRef.current);

    marker.bindPopup(`
      <div style="text-align: center; padding: 5px;">
        <strong>Your Business</strong><br>
        <small>Primary location</small>
      </div>
    `);

    markersRef.current.push(marker);
  };

  // Add grid markers (during processing)
  const addGridMarkers = () => {
    if (!mapInstanceRef.current || gridCoordinates.length === 0) return;

    gridCoordinates.forEach((coord, index) => {
      const [lat, lng] = coord.split(',').map(Number);
      
      const gridIcon = L.divIcon({
        html: `<div style="
          background: #3b82f6;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 10px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">${index + 1}</div>`,
        className: 'grid-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([lat, lng], {
        icon: gridIcon
      }).addTo(mapInstanceRef.current!);

      marker.bindPopup(`Grid Point ${index + 1}<br><small>Processing...</small>`);
      markersRef.current.push(marker);
    });
  };

  // Add ranking markers (after processing)
  const addRankingMarkers = () => {
    if (!mapInstanceRef.current || !rankDetails) return;

    rankDetails.forEach((detail) => {
      const [lat, lng] = detail.coordinate.split(',').map(Number);
      const rankColor = getRankColor(detail.rank);
      
      const rankIcon = L.divIcon({
        html: `<div style="
          background: ${rankColor};
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 13px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        ">${detail.rank}</div>`,
        className: 'ranking-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([lat, lng], {
        icon: rankIcon
      }).addTo(mapInstanceRef.current!);

      marker.bindPopup(`
        <div style="text-align: center; padding: 5px;">
          <strong>Rank: ${detail.rank}</strong><br>
          <small>Click for details</small>
        </div>
      `);

      // Add click handler for "Top Result" modal
      marker.on('click', () => {
        onMarkerClick(detail.coordinate, detail.positionId);
      });

      markersRef.current.push(marker);
    });
  };

  // Update markers based on current state
  const updateMarkers = () => {
    clearMarkers();
    addDefaultMarker();

    if (rankDetails && rankDetails.length > 0) {
      // Show ranking data
      addRankingMarkers();
    } else if (gridCoordinates.length > 0 && pollingKeyword) {
      // Show grid points only during processing
      addGridMarkers();
    }
  };

  // Zoom controls
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

  // Initialize map
  useEffect(() => {
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

    return () => {
      if (map) {
        map.remove();
      }
      const existingLink = document.querySelector('link[href*="leaflet.css"]');
      if (existingLink) {
        existingLink.remove();
      }
    };
  }, [defaultCoordinates]);

  // Update markers when data changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [gridCoordinates, rankDetails, defaultCoordinates]);

  const getTitle = () => {
    if (rankDetails && rankDetails.length > 0) {
      return 'Keyword Ranking Results';
    }
    if (pollingKeyword) {
      return 'Processing Keyword...';
    }
    return 'Geo Ranking Map';
  };

  return (
    <Card className="overflow-hidden h-[400px] sm:h-[500px] lg:h-[680px]">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle className="text-base lg:text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
          {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-full relative">
        {(loadingGrid || pollingKeyword) && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="text-center bg-white p-6 rounded-lg shadow-lg border">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                {pollingKeyword ? 'Processing Keyword Data' : 'Loading Map Data'}
              </p>
              <p className="text-xs text-gray-500">
                {pollingKeyword ? 'Analyzing search rankings...' : 'Generating grid coordinates...'}
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

        {/* Legend */}
        {rankDetails && rankDetails.length > 0 && (
          <div className="absolute bottom-4 left-4 z-20 bg-white/90 p-3 rounded-lg shadow-lg border">
            <div className="text-xs font-medium text-gray-700 mb-2">Ranking Legend</div>
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>1-3 (Top)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>4-10 (Good)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>11-15 (Fair)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>16+ (Poor)</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={mapRef} className="w-full h-[330px] sm:h-[430px] lg:h-[600px]" />
      </CardContent>
    </Card>
  );
};