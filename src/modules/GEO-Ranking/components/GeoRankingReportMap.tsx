import React, { useEffect, useRef, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import L from "leaflet";
import { RankDetail } from "@/api/geoRankingApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

// Fix for default markers in Leaflet with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface GeoRankingReportMapProps {
  defaultCoordinates: { lat: number; lng: number } | null;
  gridCoordinates: string[];
  rankDetails: RankDetail[] | null;
  pollingKeyword: boolean;
  loadingGrid: boolean;
  onMarkerClick: (coordinate: string, positionId: string) => void;
  mapPoint?: string;
  manualCoordinates?: string[];
  onAddManualCoordinate?: (coordinate: string) => void;
  onRemoveManualCoordinate?: (index: number) => void;
  onUpdateManualCoordinate?: (index: number, coordinate: string) => void;
  onClearManualCoordinates?: () => void;
}

const GeoRankingReportMapComponent: React.FC<GeoRankingReportMapProps> = ({
  defaultCoordinates,
  gridCoordinates,
  rankDetails,
  pollingKeyword,
  loadingGrid,
  onMarkerClick,
  mapPoint = "Automatic",
  manualCoordinates = [],
  onAddManualCoordinate,
  onRemoveManualCoordinate,
  onUpdateManualCoordinate,
  onClearManualCoordinates,
}) => {
  const { t } = useI18nNamespace("Geo-Ranking-module-component/GeoRankingMap");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const manualMarkersRef = useRef<L.Marker[]>([]);

  // Get rank color based on ranking
  const getRankColor = (rank: string): string => {
    const rankNum = rank === "20+" ? 21 : parseInt(rank);
    if (rankNum <= 3) return "#22c55e"; // Green
    if (rankNum <= 10) return "#f59e0b"; // Yellow
    if (rankNum <= 15) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  // Clear all markers
  const clearMarkers = () => {
    markersRef.current.forEach((marker) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];
  };

  // Clear manual markers
  const clearManualMarkers = () => {
    manualMarkersRef.current.forEach((marker) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    manualMarkersRef.current = [];
  };

  // Add default business marker
  const addDefaultMarker = () => {
    if (!mapInstanceRef.current || !defaultCoordinates) return;

    const defaultIcon = L.divIcon({
      html: `<div style="
        background: #dc2626;
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
      "></div>`,
      className: "default-business-marker",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const marker = L.marker([defaultCoordinates.lat, defaultCoordinates.lng], {
      icon: defaultIcon,
    }).addTo(mapInstanceRef.current);

    marker.bindPopup(`
      <div style="text-align: center; padding: 5px;">
        <strong>${t("mapPopup.yourBusiness")}</strong><br>
        <small>${t("mapPopup.primaryLocation")}</small>
      </div>
    `);

    markersRef.current.push(marker);
  };

  // Add grid markers (red pointers like default coordinate)
  const addGridMarkers = () => {
    if (!mapInstanceRef.current || gridCoordinates.length === 0) return;

    gridCoordinates.forEach((coord, index) => {
      const [lat, lng] = coord.split(",").map(Number);

      const gridIcon = L.divIcon({
        html: `<div style="
          background: #dc2626;
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
        "></div>`,
        className: "grid-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([lat, lng], {
        icon: gridIcon,
      }).addTo(mapInstanceRef.current!);

      marker.bindPopup(
        `${t("mapPopup.gridPoint", { index: index + 1 })}
        <br><small>${t("mapPopup.awaitingResults")}</small>`
      );
      markersRef.current.push(marker);
    });
  };

  // Add ranking markers (after processing)
  const addRankingMarkers = () => {
    if (!mapInstanceRef.current || !rankDetails) return;

    rankDetails.forEach((detail) => {
      const [lat, lng] = detail.coordinate.split(",").map(Number);
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
        className: "ranking-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([lat, lng], {
        icon: rankIcon,
      }).addTo(mapInstanceRef.current!);

      marker.bindPopup(`
        <div style="text-align: center; padding: 5px;">
          <strong>${t("mapPopup.rank", { rank: detail.rank })}</strong><br>
          <small>${t("mapPopup.clickForDetails")}</small>
        </div>
      `);

      // Add click handler for "Top Result" modal
      marker.on("click", () => {
        onMarkerClick(detail.coordinate, detail.positionId);
      });

      markersRef.current.push(marker);
    });
  };

  // Add manual markers
  const addManualMarkers = () => {
    if (!mapInstanceRef.current || manualCoordinates.length === 0) return;

    manualCoordinates.forEach((coord, index) => {
      const [lat, lng] = coord.split(",").map(Number);

      const manualIcon = L.divIcon({
        html: `<div style="
          background: #ef4444;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
        "></div>`,
        className: "manual-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([lat, lng], {
        icon: manualIcon,
        draggable: true,
      }).addTo(mapInstanceRef.current!);

      marker.bindPopup(`
        <div style="text-align: center; padding: 5px;">
          <strong>${t("mapPopup.manualCoordinate", { index: index + 1 })}
      }</strong><br>
          <small>${t("mapPopup.lat", {
            lat: lat.toFixed(6),
            lng: lng.toFixed(6),
          })}</small><br>
          <small>${t("mapPopup.drag")}</small><br>
          <button onclick="window.removeManualMarker(${index})" style="
            background: #ef4444;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            margin-top: 4px;
          ">${t("mapPopup.remove")}</button>
        </div>
      `);

      // Handle drag end
      marker.on("dragend", () => {
        const { lat: newLat, lng: newLng } = marker.getLatLng();
        const newCoord = `${newLat},${newLng}`;
        if (onUpdateManualCoordinate) {
          onUpdateManualCoordinate(index, newCoord);
        }
      });

      manualMarkersRef.current.push(marker);
    });
  };

  // Enable manual point selection on map click
  const enableManualSelection = () => {
    if (!mapInstanceRef.current || mapPoint !== "Manually") return;

    mapInstanceRef.current.on("click", (e) => {
      const { lat, lng } = e.latlng;
      const coordinate = `${lat.toFixed(6)},${lng.toFixed(6)}`;
      if (onAddManualCoordinate) {
        onAddManualCoordinate(coordinate);
      }
    });
  };

  // Global function to remove manual markers (accessible from popup)
  (window as any).removeManualMarker = (index: number) => {
    if (onRemoveManualCoordinate) {
      onRemoveManualCoordinate(index);
    }
  };

  // Calculate optimal zoom and center
  const calculateOptimalView = () => {
    if (!mapInstanceRef.current || !defaultCoordinates) return;

    let allCoordinates: [number, number][] = [];

    // Always include default coordinates
    allCoordinates.push([defaultCoordinates.lat, defaultCoordinates.lng]);

    // Add ranking coordinates if available
    if (rankDetails && rankDetails.length > 0) {
      rankDetails.forEach((detail) => {
        const [lat, lng] = detail.coordinate.split(",").map(Number);
        allCoordinates.push([lat, lng]);
      });
    } else if (gridCoordinates.length > 0) {
      // Add grid coordinates
      gridCoordinates.forEach((coord) => {
        const [lat, lng] = coord.split(",").map(Number);
        allCoordinates.push([lat, lng]);
      });
    }

    if (allCoordinates.length > 1) {
      // Use fitBounds for multiple coordinates
      const bounds = L.latLngBounds(allCoordinates);
      mapInstanceRef.current.fitBounds(bounds, {
        padding: [20, 20],
        maxZoom: 16,
      });
    } else {
      // Single coordinate - use distance-based zoom
      const zoom = getZoomForDistance();
      mapInstanceRef.current.setView(
        [defaultCoordinates.lat, defaultCoordinates.lng],
        zoom
      );
    }
  };

  // Calculate zoom based on distance settings
  const getZoomForDistance = (): number => {
    // This would need access to distance settings from props
    // For now, return a reasonable default
    return 14;
  };

  // Update markers based on current state
  const updateMarkers = () => {
    // Ensure map and defaultCoordinates are available before updating markers
    if (!mapInstanceRef.current || !defaultCoordinates) return;

    clearMarkers();
    clearManualMarkers();

    // Always show ranking data when available (highest priority)
    if (rankDetails && rankDetails.length > 0) {
      // Show ranking results - these replace all other markers
      addRankingMarkers();
    } else if (mapPoint === "Manually") {
      // Show manual markers when no ranking data is available
      addManualMarkers();
    } else {
      // Add default marker for automatic mode when no ranking data
      addDefaultMarker();

      if (gridCoordinates.length > 0) {
        // Show grid points when coordinates exist
        addGridMarkers();
      }
    }

    // Auto-adjust view after markers are added
    setTimeout(() => calculateOptimalView(), 100);
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
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    if (!mapRef.current || !defaultCoordinates) return;

    const map = L.map(mapRef.current).setView(
      [defaultCoordinates.lat, defaultCoordinates.lng],
      14
    );
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Enable manual selection after map is initialized
    setTimeout(() => enableManualSelection(), 100);

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
    if (mapInstanceRef.current && defaultCoordinates) {
      updateMarkers();
    }
  }, [
    gridCoordinates,
    rankDetails,
    defaultCoordinates,
    mapPoint,
    manualCoordinates,
  ]);

  // Re-enable manual selection when mapPoint changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      // Remove previous click handlers
      mapInstanceRef.current.off("click");
      // Re-enable manual selection
      setTimeout(() => enableManualSelection(), 100);
    }
  }, [mapPoint]);

  const getTitle = () => {
    if (rankDetails && rankDetails.length > 0) {
      return t("title.results");
    }
    if (pollingKeyword) {
      return t("title.processing");
    }
    return t("title.default");
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle className="text-base lg:text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />
          {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative">
        {(loadingGrid || pollingKeyword) && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-[9999] rounded-lg">
            <div className="text-center bg-white p-6 rounded-lg shadow-lg border">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                {pollingKeyword
                  ? t("loading.keywordTitle")
                  : t("loading.gridTitle")}
              </p>
              <p className="text-xs text-gray-500">
                {pollingKeyword
                  ? t("loading.keywordSubtitle")
                  : t("loading.gridSubtitle")}
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
            title={t("zoom.in")}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleZoomOut}
            className="w-10 h-10 p-0 bg-white/90 hover:bg-white border shadow-lg"
            title={t("zoom.out")}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Legend */}
        {rankDetails && rankDetails.length > 0 && (
          <div className="absolute bottom-4 left-4 z-20 bg-white/90 p-3 rounded-lg shadow-lg border">
            <div className="text-xs font-medium text-gray-700 mb-2">
              {t("legend.title")}
            </div>
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>{t("legend.top")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>{t("legend.good")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>{t("legend.fair")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>{t("legend.poor")}</span>
              </div>
            </div>
          </div>
        )}

        <div
          ref={mapRef}
          className="w-full h-[330px] sm:h-[430px] lg:h-[600px] z-0"
        />
      </CardContent>
    </Card>
  );
};

// Memoized export with custom comparison function to prevent unnecessary re-renders
export const GeoRankingReportMap = memo(
  GeoRankingReportMapComponent,
  (prevProps, nextProps) => {
    // Compare map-relevant props only, ignore callback function references
    return (
      JSON.stringify(prevProps.defaultCoordinates) ===
        JSON.stringify(nextProps.defaultCoordinates) &&
      JSON.stringify(prevProps.gridCoordinates) ===
        JSON.stringify(nextProps.gridCoordinates) &&
      JSON.stringify(prevProps.rankDetails) ===
        JSON.stringify(nextProps.rankDetails) &&
      JSON.stringify(prevProps.manualCoordinates) ===
        JSON.stringify(nextProps.manualCoordinates) &&
      prevProps.pollingKeyword === nextProps.pollingKeyword &&
      prevProps.loadingGrid === nextProps.loadingGrid &&
      prevProps.mapPoint === nextProps.mapPoint
    );
  }
);
