
import React, { useEffect, useRef, memo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { RankDetail } from "../../api/geoRankingApi";
import L from "leaflet";

interface RankingMapProps {
  onMarkerClick: (gpsCoordinates: string, gridId: string) => void;
  rankDetails: RankDetail[];
}

export const RankingMap: React.FC<RankingMapProps> = memo(
  ({ onMarkerClick, rankDetails }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const lastRankDetailsRef = useRef<string>('');

    // Clear all markers without destroying map
    const clearMarkers = () => {
      markersRef.current.forEach((marker) => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(marker);
        }
      });
      markersRef.current = [];
    };

    // Add markers to existing map
    const addMarkersToMap = (details: RankDetail[]) => {
      if (!mapInstanceRef.current || !details.length) return;

      clearMarkers();

      details.forEach((detail, index) => {
        const coords = detail.coordinate.split(",");
        if (coords.length === 2) {
          const lat = parseFloat(coords[0]);
          const lng = parseFloat(coords[1]);
          const ranking = parseInt(detail.rank);

          const color =
            ranking <= 3
              ? "#22c55e"
              : ranking <= 10
              ? "#f59e0b"
              : ranking <= 15
              ? "#f97316"
              : "#ef4444";

          const displayText = ranking >= 20 ? "20+" : ranking.toString();
          const fontSize = ranking >= 20 ? "11px" : "13px";

          const rankingIcon = L.divIcon({
            html: `<div style="
            background: ${color};
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: ${fontSize};
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            cursor: pointer;
          ">${displayText}</div>`,
            className: "custom-ranking-marker",
            iconSize: [50, 50],
            iconAnchor: [25, 25],
          });

          const marker = L.marker([lat, lng], {
            icon: rankingIcon,
          }).addTo(mapInstanceRef.current);

          marker.on("click", () => {
            const gpsCoordinates = `${lat.toFixed(13)},${lng.toFixed(13)}`;
            onMarkerClick(gpsCoordinates, detail.positionId);
          });

          marker.bindPopup(`
          <div class="text-sm">
            <strong>Position: ${displayText}</strong><br>
            Location: ${detail.coordinate}<br>
            Position ID: ${detail.positionId}<br>
            <em>Click for detailed view</em>
          </div>
        `);

          markersRef.current.push(marker);
        }
      });
    };

    // Initialize map only once
    useEffect(() => {
      if (!mapRef.current || isInitialized) return;

      console.log(`🗺️ [${new Date().toISOString()}] Initializing map for the first time`);

      // Load Leaflet CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      // Calculate center coordinates
      let centerLat = 28.6139;
      let centerLng = 77.209;
      let allCoordinates: [number, number][] = [];

      if (rankDetails.length > 0) {
        rankDetails.forEach((detail) => {
          const coords = detail.coordinate.split(",");
          if (coords.length === 2) {
            const lat = parseFloat(coords[0]);
            const lng = parseFloat(coords[1]);
            allCoordinates.push([lat, lng]);
          }
        });

        if (allCoordinates.length > 0) {
          centerLat = allCoordinates[0][0];
          centerLng = allCoordinates[0][1];
        }
      }

      // Initialize map
      const map = L.map(mapRef.current).setView([centerLat, centerLng], 13);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      setIsInitialized(true);

      // Add initial markers
      if (rankDetails.length > 0) {
        addMarkersToMap(rankDetails);
        
        // Auto-fit bounds if we have multiple coordinates
        if (allCoordinates.length > 1) {
          const bounds = L.latLngBounds(allCoordinates);
          map.whenReady(() => {
            const container = map.getContainer();
            const isVisible = container && container.offsetParent !== null;

            if (isVisible && map && map.getSize().x > 0 && map.getSize().y > 0) {
              map.fitBounds(bounds, {
                padding: [20, 20],
                maxZoom: 16,
                animate: true,
              });
            }
          });
        }
      } else {
        // Generate fallback grid data
        const generateGridData = () => {
          const gridData = [];
          const spacing = 0.005;

          for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
              const lat = centerLat + (i - 1.5) * spacing;
              const lng = centerLng + (j - 1.5) * spacing;
              const ranking = Math.floor(Math.random() * 25) + 1;
              gridData.push({
                lat,
                lng,
                ranking,
                id: `${i}-${j}`,
              });
            }
          }
          return gridData;
        };

        const gridData = generateGridData();
        gridData.forEach((point) => {
          const color =
            point.ranking <= 3
              ? "#22c55e"
              : point.ranking <= 10
              ? "#f59e0b"
              : point.ranking <= 15
              ? "#f97316"
              : "#ef4444";

          const displayText = point.ranking >= 20 ? "20+" : point.ranking.toString();
          const fontSize = point.ranking >= 20 ? "12px" : "14px";

          const rankingIcon = L.divIcon({
            html: `<div style="
            background: ${color};
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: ${fontSize};
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            cursor: pointer;
          ">${displayText}</div>`,
            className: "custom-ranking-marker",
            iconSize: [50, 50],
            iconAnchor: [25, 25],
          });

          const marker = L.marker([point.lat, point.lng], {
            icon: rankingIcon,
          }).addTo(map);

          marker.on("click", () => {
            const gpsCoordinates = `${point.lat.toFixed(13)},${point.lng.toFixed(13)}`;
            onMarkerClick(gpsCoordinates, point.id);
          });

          marker.bindPopup(`
          <div class="text-sm">
            <strong>Position: ${displayText}</strong><br>
            Location: Grid ${point.id}<br>
            <em>Click for detailed view</em>
          </div>
        `);

          markersRef.current.push(marker);
        });
      }

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
        setIsInitialized(false);
        const existingLink = document.querySelector('link[href*="leaflet.css"]');
        if (existingLink) {
          existingLink.remove();
        }
      };
    }, [isInitialized]); // Only depend on isInitialized

    // Update markers when rankDetails change (but don't re-initialize map)
    useEffect(() => {
      if (!isInitialized || !mapInstanceRef.current) return;

      const newRankDetailsString = JSON.stringify(rankDetails);
      if (lastRankDetailsRef.current === newRankDetailsString) {
        console.log(`🗺️ [${new Date().toISOString()}] Skipping marker update - no rank details change`);
        return;
      }

      console.log(`🗺️ [${new Date().toISOString()}] Updating markers without re-initializing map`);
      lastRankDetailsRef.current = newRankDetailsString;
      addMarkersToMap(rankDetails);
    }, [rankDetails, isInitialized]);

    return (
      <Card className="bg-white">
        <CardContent className="sm:p-0">
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <div ref={mapRef} className="w-full h-[400px] sm:h-[500px]" />
          </div>
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    // Enhanced memo comparison - only re-render if rankDetails actually changed
    const prevRankDetailsString = JSON.stringify(prevProps.rankDetails);
    const nextRankDetailsString = JSON.stringify(nextProps.rankDetails);
    
    const shouldNotRerender = prevRankDetailsString === nextRankDetailsString &&
                             prevProps.onMarkerClick === nextProps.onMarkerClick;
    
    if (shouldNotRerender) {
      console.log(`🗺️ [${new Date().toISOString()}] Preventing map re-render - no meaningful changes`);
    }
    
    return shouldNotRerender;
  }
);
