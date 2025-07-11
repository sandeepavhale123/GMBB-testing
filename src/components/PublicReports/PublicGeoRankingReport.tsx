import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { PublicReportDashboardLayout } from './PublicReportDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { MapPin, TrendingUp, Target, Users, Clock } from 'lucide-react';
import { CircularProgress } from '@/components/ui/circular-progress';
import L from 'leaflet';
// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export const PublicGeoRankingReport: React.FC = () => {
  const { token } = useParams();
  const [selectedKeyword, setSelectedKeyword] = useState('Webdesign');
  const [frequency, setFrequency] = useState('Weekly');
  const [reportType, setReportType] = useState<'individual' | 'comparison'>('individual');
  
  // Map refs for individual view
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  // Map refs for comparison view
  const mapRef1 = useRef<HTMLDivElement>(null);
  const mapInstanceRef1 = useRef<L.Map | null>(null);
  const markersRef1 = useRef<L.Marker[]>([]);
  
  const mapRef2 = useRef<HTMLDivElement>(null);
  const mapInstanceRef2 = useRef<L.Map | null>(null);
  const markersRef2 = useRef<L.Marker[]>([]);

  // Sample data with coordinates
  const geoData = {
    companyName: 'Demo Business',
    companyLogo: null,
    overview: {
      totalKeywords: 45,
      overallVisibility: 6.20,
      selectedKeyword: 'Webdesign',
      frequency: 'Weekly'
    },
    keywords: ['Webdesign', 'Digital Marketing', 'SEO Services', 'Local Business', 'Web Development'],
    gridData: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    // Demo coordinates (centered around San Francisco)
    defaultCoordinates: { lat: 37.7749, lng: -122.4194 },
    rankDetails: [
      { coordinate: "37.7849,-122.4094", rank: "1", positionId: "1" },
      { coordinate: "37.7649,-122.4294", rank: "2", positionId: "2" },
      { coordinate: "37.7749,-122.4394", rank: "3", positionId: "3" },
      { coordinate: "37.7849,-122.4294", rank: "4", positionId: "4" },
      { coordinate: "37.7649,-122.4094", rank: "5", positionId: "5" },
      { coordinate: "37.7749,-122.4194", rank: "6", positionId: "6" },
      { coordinate: "37.7849,-122.4394", rank: "7", positionId: "7" },
      { coordinate: "37.7649,-122.4394", rank: "8", positionId: "8" },
      { coordinate: "37.7549,-122.4194", rank: "9", positionId: "9" }
    ]
  };

  // Sample data for comparison (second dataset)
  const comparisonData = {
    companyName: 'Competitor Business',
    companyLogo: null,
    overview: {
      totalKeywords: 38,
      overallVisibility: 4.80,
      selectedKeyword: 'Webdesign',
      frequency: 'Weekly'
    },
    keywords: ['Webdesign', 'Digital Marketing', 'SEO Services', 'Local Business', 'Web Development'],
    gridData: [[3, 5, 7], [2, 8, 4], [9, 6, 1]],
    // Demo coordinates (centered around Los Angeles)
    defaultCoordinates: { lat: 34.0522, lng: -118.2437 },
    rankDetails: [
      { coordinate: "34.0622,-118.2337", rank: "3", positionId: "1" },
      { coordinate: "34.0422,-118.2537", rank: "5", positionId: "2" },
      { coordinate: "34.0522,-118.2637", rank: "7", positionId: "3" },
      { coordinate: "34.0622,-118.2537", rank: "2", positionId: "4" },
      { coordinate: "34.0422,-118.2337", rank: "8", positionId: "5" },
      { coordinate: "34.0522,-118.2437", rank: "4", positionId: "6" },
      { coordinate: "34.0622,-118.2637", rank: "9", positionId: "7" },
      { coordinate: "34.0422,-118.2637", rank: "6", positionId: "8" },
      { coordinate: "34.0322,-118.2437", rank: "1", positionId: "9" }
    ]
  };
  // Get rank color for grid display
  const getRankingColor = (position: number) => {
    if (position <= 3) return 'bg-green-500';
    if (position <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get rank color for map markers (hex colors)
  const getRankColorHex = (rank: string): string => {
    const rankNum = rank === "20+" ? 21 : parseInt(rank);
    if (rankNum <= 3) return "#22c55e"; // Green
    if (rankNum <= 6) return "#f59e0b"; // Yellow
    return "#ef4444"; // Red
  };

  // Clear all markers
  const clearMarkers = (mapInstance: React.RefObject<L.Map>, markers: React.RefObject<L.Marker[]>) => {
    markers.current.forEach((marker) => {
      if (mapInstance.current) {
        mapInstance.current.removeLayer(marker);
      }
    });
    markers.current.length = 0;
  };

  // Add ranking markers
  const addRankingMarkers = (
    mapInstance: React.RefObject<L.Map>, 
    markers: React.RefObject<L.Marker[]>, 
    data: typeof geoData
  ) => {
    if (!mapInstance.current || !data.rankDetails) return;

    data.rankDetails.forEach((detail) => {
      const [lat, lng] = detail.coordinate.split(",").map(Number);
      const rankColor = getRankColorHex(detail.rank);

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
        ">${detail.rank}</div>`,
        className: "ranking-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([lat, lng], {
        icon: rankIcon,
      }).addTo(mapInstance.current!);

      marker.bindPopup(`
        <div style="text-align: center; padding: 5px;">
          <strong>Rank: ${detail.rank}</strong><br>
          <small>Position ${detail.positionId}</small>
        </div>
      `);

      markers.current.push(marker);
    });
  };

  // Initialize single map
  const initializeMap = (
    mapRef: React.RefObject<HTMLDivElement>,
    mapInstanceRef: React.RefObject<L.Map>,
    markersRef: React.RefObject<L.Marker[]>,
    data: typeof geoData
  ) => {
    // Check if DOM element exists and is mounted
    if (!mapRef.current || !data.defaultCoordinates) {
      console.log('Map container not ready or no coordinates');
      return null;
    }

    // Clean up existing map instance if it exists
    if ((mapInstanceRef as any).current) {
      try {
        (mapInstanceRef as any).current.remove();
      } catch (e) {
        console.log('Error removing existing map:', e);
      }
      (mapInstanceRef as any).current = null;
    }

    // Clear the DOM container completely
    const container = mapRef.current;
    container.innerHTML = '';
    (container as any)._leaflet_id = null; // Clear Leaflet's internal ID
    
    try {
      const map = L.map(container).setView(
        [data.defaultCoordinates.lat, data.defaultCoordinates.lng],
        12
      );
      (mapInstanceRef as any).current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add markers after map is fully initialized
      setTimeout(() => {
        addRankingMarkers(mapInstanceRef, markersRef, data);
      }, 100);

      return map;
    } catch (error) {
      console.error('Error initializing map:', error);
      return null;
    }
  };

  // Initialize maps based on report type
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    // Clean up all existing maps first
    const cleanupMap = (mapInstanceRef: React.RefObject<L.Map>, mapRef: React.RefObject<HTMLDivElement>) => {
      if ((mapInstanceRef as any).current) {
        try {
          (mapInstanceRef as any).current.remove();
        } catch (e) {
          console.log('Error during map cleanup:', e);
        }
        (mapInstanceRef as any).current = null;
      }
      
      // Clear DOM container
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
        (mapRef.current as any)._leaflet_id = null;
      }
    };

    cleanupMap(mapInstanceRef, mapRef);
    cleanupMap(mapInstanceRef1, mapRef1);
    cleanupMap(mapInstanceRef2, mapRef2);

    let map1: L.Map | null = null;
    let map2: L.Map | null = null;

    // Use setTimeout to ensure DOM elements are ready
    const initMaps = setTimeout(() => {
      if (reportType === 'individual') {
        map1 = initializeMap(mapRef, mapInstanceRef, markersRef, geoData);
      } else {
        // Initialize both maps for comparison with additional delay
        map1 = initializeMap(mapRef1, mapInstanceRef1, markersRef1, geoData);
        setTimeout(() => {
          map2 = initializeMap(mapRef2, mapInstanceRef2, markersRef2, comparisonData);
        }, 50);
      }
    }, 100);

    return () => {
      clearTimeout(initMaps);
      
      // Cleanup all maps
      cleanupMap(mapInstanceRef, mapRef);
      cleanupMap(mapInstanceRef1, mapRef1);
      cleanupMap(mapInstanceRef2, mapRef2);
      
      const existingLink = document.querySelector('link[href*="leaflet.css"]');
      if (existingLink) {
        existingLink.remove();
      }
    };
  }, [reportType]);

  // Update markers when keyword changes
  useEffect(() => {
    // Add delay to ensure maps are fully initialized
    const updateMarkers = setTimeout(() => {
      if (reportType === 'individual' && (mapInstanceRef as any).current) {
        clearMarkers(mapInstanceRef, markersRef);
        addRankingMarkers(mapInstanceRef, markersRef, geoData);
      } else if (reportType === 'comparison') {
        if ((mapInstanceRef1 as any).current) {
          clearMarkers(mapInstanceRef1, markersRef1);
          addRankingMarkers(mapInstanceRef1, markersRef1, geoData);
        }
        if ((mapInstanceRef2 as any).current) {
          clearMarkers(mapInstanceRef2, markersRef2);
          addRankingMarkers(mapInstanceRef2, markersRef2, comparisonData);
        }
      }
    }, 200);

    return () => clearTimeout(updateMarkers);
  }, [selectedKeyword, reportType]);
  return <PublicReportDashboardLayout title="GEO Ranking Report" companyName={geoData.companyName} companyLogo={geoData.companyLogo}>
      <div className="space-y-6">
        {/* First Row - Control Panel */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Column 1: Keyword Selection */}
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Select Keyword</label>
                <Select value={selectedKeyword} onValueChange={setSelectedKeyword}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {geoData.keywords.map(keyword => <SelectItem key={keyword} value={keyword}>{keyword}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Column 2: Overall Visibility */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center justify-between h-full">
                  <div className="flex-1">
                    <div className="text-xs text-blue-600 font-medium mb-1">Overall Visibility</div>
                    <div className="text-2xl font-bold text-blue-900">{geoData.overview.overallVisibility}%</div>
                  </div>
                  <div className="w-12 h-12 flex-shrink-0">
                    <CircularProgress value={geoData.overview.overallVisibility} size={48} className="text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Column 3: Total Keywords */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="text-xs text-orange-600 font-medium mb-1">Total Keywords</div>
                <div className="text-2xl font-bold text-orange-900">{geoData.overview.totalKeywords}</div>
              </div>

              {/* Column 4: Keyword Frequency */}
              <div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="text-xs text-purple-600 font-medium mb-1">Report Frequency</div>
                  <div className="text-lg font-bold text-purple-900">{frequency}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Type Toggle */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">GEO Ranking Report</h2>
                <p className="text-muted-foreground mb-1">February 01 2025 - February 28 2025</p>
                <p className="text-sm text-muted-foreground">Keyword: <span className="font-medium">{selectedKeyword}</span></p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${reportType === 'individual' ? 'text-primary' : 'text-muted-foreground'}`}>
                  Individual
                </span>
                <Switch
                  checked={reportType === 'comparison'}
                  onCheckedChange={(checked) => setReportType(checked ? 'comparison' : 'individual')}
                />
                <span className={`text-sm font-medium ${reportType === 'comparison' ? 'text-primary' : 'text-muted-foreground'}`}>
                  Comparison
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GEO Ranking Report Content */}
        {reportType === 'individual' ? (
          <Card>
            <CardContent className="p-6">
              {/* Map Display */}
              <div>
                <div className="relative">
                  <div
                    ref={mapRef}
                    key={`individual-map-${reportType}`}
                    className="w-full h-[400px] rounded-lg border z-0"
                  />
                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 z-20 bg-white/90 p-3 rounded-lg shadow-lg border">
                    <div className="text-xs font-medium text-gray-700 mb-2">
                      Ranking Legend
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>1-3 (Top)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span>4-6 (Good)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>7+ (Poor)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Report Card */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">{geoData.companyName}</h3>
                  <p className="text-sm text-muted-foreground">Visibility: {geoData.overview.overallVisibility}%</p>
                </div>
                <div className="relative">
                  <div
                    ref={mapRef1}
                    key={`comparison-map-1-${reportType}`}
                    className="w-full h-[350px] rounded-lg border z-0"
                  />
                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 z-20 bg-white/90 p-2 rounded-lg shadow-lg border">
                    <div className="text-xs font-medium text-gray-700 mb-1">
                      Legend
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>1-3</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span>4-6</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span>7+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Second Report Card */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">{comparisonData.companyName}</h3>
                  <p className="text-sm text-muted-foreground">Visibility: {comparisonData.overview.overallVisibility}%</p>
                </div>
                <div className="relative">
                  <div
                    ref={mapRef2}
                    key={`comparison-map-2-${reportType}`}
                    className="w-full h-[350px] rounded-lg border z-0"
                  />
                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 z-20 bg-white/90 p-2 rounded-lg shadow-lg border">
                    <div className="text-xs font-medium text-gray-700 mb-1">
                      Legend
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>1-3</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span>4-6</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span>7+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PublicReportDashboardLayout>;
};